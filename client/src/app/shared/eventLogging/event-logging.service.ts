import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
    })
export class EventLoggingService {
  
    // Needs to be used every time a journal entry is completed.
    // Must 

    logEvent(arg0: string, arg1: { accountId: string; }) {
        throw new Error("Method not implemented."); 
    }
}