import { BehaviorSubject, Subject, combineLatest, distinctUntilChanged, map } from "rxjs";
import { JournalEntry, JournalEntryStatus } from "../dataModels/financialModels/account-ledger.model";
import { Injectable } from "@angular/core";
import { JournalEntryFirestoreService } from "../services/firestoreService/journal-firestore.service";
import { ErrorHandlingService } from "../services/error-handling.service";
import { FilteringService } from "../services/filter.service";

  export interface JournalFilter{
    id?: string;
    entryNumber?: string;
    dateStart?: Date;
    dateEnd?: Date;
    status: JournalEntryStatus;
    createdBy?: string;
  }

  @Injectable({ providedIn: 'root' })
  export class JournalEntryStateService {
    private readonly journalEntriesSubject = new BehaviorSubject<JournalEntry[]>([] as JournalEntry[]);
    private filterSubject = new Subject<JournalFilter>();
    private readonly journalEntries$ = this.journalEntriesSubject.asObservable();
  


    private filteredJournalEntriesSubject = new BehaviorSubject<JournalEntry[]>([]);

    constructor(
      private journalEntryFirestoreService: JournalEntryFirestoreService,
      private errorHandlingService: ErrorHandlingService,
      private filterService: FilteringService
    ) {
      this.initializeJournalEntries(journalEntryFirestoreService, errorHandlingService);
    }
    
    initializeJournalEntries(journalEntryService: JournalEntryFirestoreService, errorHandlingService: ErrorHandlingService) {
      journalEntryService.journalEntries$.subscribe(
        (journalEntries) => {
          this.journalEntriesSubject.next(journalEntries);
        }
      );
    }
    
    readonly filteredJournalEntries$ = combineLatest([this.journalEntries$, this.filterSubject]).pipe(
      map(([journalEntries, filter]) => this.filterService.filter(journalEntries, filter, [
        'id',
        'entryNumber',
        'dateStart',
        'dateEnd',
        'status',
        'createdBy'
      ])),
      distinctUntilChanged(),
    );

    updateFilters(filter: JournalFilter) {
      this.filterSubject.next(filter);
    }
    
  }