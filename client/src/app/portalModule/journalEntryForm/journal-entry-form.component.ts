import { Component, OnInit, inject } from '@angular/core';
import { AccountFirestoreService } from '../../shared/firestoreService/accountStore/data-access/account-firestore.service';

@Component({
  selector: 'app-journal-entry-form',
  templateUrl: './journal-entry-form.component.html'
})
export class JournalEntryFormComponent{
  private accountFirestoreService = inject(AccountFirestoreService);
  
  constructor() {
  }

}
