interface JournalEntryState {
    entries: JournalEntry[];
    drafts: JournalEntryDraft[];
    selectedEntry: string | null;
    filters: JournalEntryFilter | null;
  }
  
  @Injectable({ providedIn: 'root' })
  export class JournalEntryStateService {
    private readonly entryStateSubject = new BehaviorSubject<JournalEntryState>(initialEntryState);
  
    readonly pendingEntries$ = this.entryStateSubject.pipe(
      map(state => state.entries.filter(e => e.status === 'pending')),
      distinctUntilChanged()
    );
  
    readonly activeDrafts$ = this.entryStateSubject.pipe(
      map(state => state.drafts),
      distinctUntilChanged()
    );
  }