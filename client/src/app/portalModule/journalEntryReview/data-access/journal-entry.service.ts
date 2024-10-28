import { Injectable, inject } from "@angular/core";
import { AccountFirestoreService } from "../../../shared/firestoreService/accountStore/data-access/account-firestore.service";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";


@Injectable({
    providedIn: 'root'
})
export class JournalEntryService{
    private accountFirestoreService = inject(AccountFirestoreService);

    constructor() {}
    //Retrieve all journal entries according to filters
    getJournalEntries(accountId?: string, startDate?: Date, endDate?: Date){
        return this.accountFirestoreService.getJournalEntries(accountId, startDate, endDate);
    }

    addJournalEntry(journalEntry: JournalEntry) {
        return this.accountFirestoreService.addJournalEntry(journalEntry);
    }


}