// filter-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountFilter } from '../../../shared/dataModels/financialModels/account-ledger.model';

@Component({
  selector: 'filter-card',
  template: `
    <h2 mat-dialog-title>Filter Accounts</h2>
    <mat-dialog-content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <!-- Account Number -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Account Number</mat-label>
          <input 
            matInput
            [(ngModel)]="filter.accountNumber"
            placeholder="Enter account number"
          >
        </mat-form-field>

        <!-- Account Name -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Account Name</mat-label>
          <input 
            matInput
            [(ngModel)]="filter.accountName"
            placeholder="Enter account name"
          >
        </mat-form-field>

        <!-- Category -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="filter.category">
            <mat-option [value]="null">All</mat-option>
            <mat-option value="ASSET">Asset</mat-option>
            <mat-option value="LIABILITY">Liability</mat-option>
            <mat-option value="EQUITY">Equity</mat-option>
            <mat-option value="REVENUE">Revenue</mat-option>
            <mat-option value="EXPENSE">Expense</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Subcategory -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Subcategory</mat-label>
          <input 
            matInput
            [(ngModel)]="filter.subcategory"
            placeholder="Enter subcategory"
          >
        </mat-form-field>

        <!-- Normal Side -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Normal Side</mat-label>
          <mat-select [(ngModel)]="filter.normalSide">
            <mat-option [value]="null">All</mat-option>
            <mat-option value="DEBIT">Debit</mat-option>
            <mat-option value="CREDIT">Credit</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Status -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="filter.isActive">
            <mat-option [value]="null">All</mat-option>
            <mat-option [value]="true">Active</mat-option>
            <mat-option [value]="false">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onApply()">Apply</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      max-width: 600px;
      width: 100%;
    }
    
    .mat-dialog-content {
      max-height: 70vh;
    }
  `]
})
export class FilterDialogComponent {
  filter: AccountFilter;

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentFilter: AccountFilter }
  ) {
    this.filter = { ...data.currentFilter || {} };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onApply(): void {
    // Remove null values before closing
    const cleanFilter = Object.fromEntries(
      Object.entries(this.filter).filter(([_, value]) => value != null)
    );
    this.dialogRef.close(cleanFilter);
  }
}