import { Component } from '@angular/core';

@Component({
  selector: 'app-portal-dashboard',
  template: `
  <div class="min-h-screen flex flex-col items-center pt-20">
    <div class="w-full max-w-3xl">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Accounting Dashboard</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <!-- Chart of Accounts Button -->
            <button routerLink="/portal/chart-of-accounts" class="bg-white hover:bg-gray-50 transition-all p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-200 hover:border-blue-500 group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-lg font-semibold text-gray-700">Chart of Accounts</span>
            </button>

            <!-- Journal Entry Review Button -->
            <button routerLink="/portal/journal-entry-review" class="bg-white hover:bg-gray-50 transition-all p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-200 hover:border-blue-500 group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-lg font-semibold text-gray-700">Journal Entry Review</span>
            </button>

            <!-- Account Ledger Button -->
            <button routerLink="/portal/journal-entry-form" class="bg-white hover:bg-gray-50 transition-all p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-200 hover:border-blue-500 group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span class="text-lg font-semibold text-gray-700">Journal Entry Form</span>
            </button>
        </div>
    </div>
</div>`,
})
export class PortalDashboardComponent {

}
