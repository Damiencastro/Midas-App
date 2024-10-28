import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { JournalEntry } from '../../../shared/dataModels/financialModels/account-ledger.model';

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  try {
    const db = getFirestore();
    const journalEntriesRef = collection(db, 'journalEntries');
    const querySnapshot = await getDocs(journalEntriesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as JournalEntry[];
    
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
}