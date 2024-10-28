import { Component, EventEmitter, Input, Output } from "@angular/core";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: 'journal-review-card',
    template: `
    <ng-container *ngIf="(journalEntries$ | async) as journalEntriesList">
        <tr *ngFor="let journalEntry of journalEntriesList" class="hover:bg-gray-50">
          <td class="p-2 border">{{journalEntry.createdAt}}</td>
          <td class="p-2 border">{{journalEntry.createdBy}}</td>
          <td class="p-2 border">{{journalEntry.date}}</td>
          <td class="p-2 border">{{journalEntry.id}}</td>
          <td class="p-2 border text-right">
            {{journalEntry.totalDebits}}
          </td>
          <td class="p-2 border text-right">
            {{journalEntry.totalCredits}}
          </td>
          <td class="p-2 border text-center">{{journalEntry.isBalanced}}</td>
          <td class="p-2 border text-center">
            <span 
              [class]="journalEntry.isBalanced ? 'text-green-600' : 'text-red-600'"
            >
              {{journalEntry.isBalanced}}
            </span>
          </td>
          <td class="p-2 border text-center">
            <button (click)="chooseJournalEntry(journalEntry)" class="text-blue-600 mx-1">
              Edit
            </button>
          </td>
        </tr>
      </ng-container>
    `
})
export class JournalReviewCard {
    @Input() journalEntries$?: Observable<JournalEntry[]> = undefined;
    @Output() chosenJournalEntry = new EventEmitter<JournalEntry>();

    chooseJournalEntry(journalEntry: JournalEntry) {
        this.chosenJournalEntry.emit(journalEntry);
    }
}