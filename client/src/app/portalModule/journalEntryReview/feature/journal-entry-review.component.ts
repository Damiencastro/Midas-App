// journal-entry-form.component.ts
import { Component, inject, OnInit } from "@angular/core";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";
import { JournalEntryService } from "../data-access/journal-entry.service";
import { BehaviorSubject, Observable } from "rxjs";
import { Firestore } from "@angular/fire/firestore";
import { getAllJournalEntries } from "../utils/get-journal-entries";

@Component({
    selector: 'app-journal-entry-form',
    template: `
        <journal-review-card
            [journalEntries$]="journalEntries$"
            (chosenJournalEntry)="routeToJournalEntry($event)"
        ></journal-review-card>
    `,
    styleUrl:'../ui/journal-review.card.stylesheet.scss'
})
export class JournalEntryReviewComponent implements OnInit {
    private firestore = inject(Firestore);
    private journalEntryService = inject(JournalEntryService);
    private journalEntriesSubject = new BehaviorSubject<JournalEntry[]>([]);
    readonly journalEntries$: Observable<JournalEntry[]> = this.journalEntriesSubject.asObservable();

    ngOnInit() {
        this.initializeJournalEntrySubscription();
    }

    private initializeJournalEntrySubscription() {
        this.journalEntryService.getJournalEntries().subscribe({
            next: (journalEntries) => {
                this.journalEntriesSubject.next(journalEntries || []);
            },
            error: async (error) => {
                try {
                    const journalEntries = await getAllJournalEntries();
                    this.journalEntriesSubject.next(journalEntries || []);
                } catch (error) {
                    console.error('Error fetching journal entries:', error);
                    this.journalEntriesSubject.next([]);
                }
            }
        });
    }


    routeToJournalEntry(journalEntry: JournalEntry) {
        // Route to journal entry
    }
}