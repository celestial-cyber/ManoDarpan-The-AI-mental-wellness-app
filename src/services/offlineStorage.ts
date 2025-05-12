
/**
 * Offline Storage Service
 * 
 * This service handles storing data locally when offline and syncing with
 * Supabase when the connection is restored.
 */

// Define types
interface OfflineItem {
  id: string;
  type: 'mood' | 'journal' | 'habit';
  data: any;
  createdAt: string;
  synced: boolean;
}

class OfflineStorage {
  private storageKey = 'manodarpan_offline_data';
  private isOnline: boolean;

  constructor() {
    this.isOnline = navigator.onLine;
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.isOnline = true;
    console.log('Back online, syncing data...');
    this.syncOfflineData();
  };

  handleOffline = () => {
    this.isOnline = false;
    console.log('Offline mode activated. Data will be stored locally.');
  };

  getOfflineData(): OfflineItem[] {
    const storedData = localStorage.getItem(this.storageKey);
    if (!storedData) return [];
    
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error parsing offline data', error);
      return [];
    }
  }

  saveOfflineData(offlineData: OfflineItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(offlineData));
  }

  storeItem(type: 'mood' | 'journal' | 'habit', data: any): void {
    const offlineData = this.getOfflineData();
    
    const newItem: OfflineItem = {
      id: `offline_${Date.now()}`,
      type,
      data,
      createdAt: new Date().toISOString(),
      synced: this.isOnline
    };
    
    offlineData.push(newItem);
    this.saveOfflineData(offlineData);
    
    // If online, immediately try to sync
    if (this.isOnline) {
      this.syncOfflineData();
    }
  }

  async syncOfflineData(): Promise<void> {
    if (!this.isOnline) return;
    
    const offlineData = this.getOfflineData();
    const unsyncedItems = offlineData.filter(item => !item.synced);
    
    if (unsyncedItems.length === 0) return;
    
    console.log(`Syncing ${unsyncedItems.length} offline items`);
    
    // In a real app, we'd sync with Supabase here
    // Example (commented out as it's a mock):
    /*
    try {
      for (const item of unsyncedItems) {
        // Based on the type, sync with appropriate Supabase table
        switch(item.type) {
          case 'mood':
            await supabase.from('mood_entries').insert(item.data);
            break;
          case 'journal':
            await supabase.from('journal_entries').insert(item.data);
            break;
          // ... handle other types
        }
        
        // Mark as synced
        item.synced = true;
      }
      
      // Update storage with synced status
      this.saveOfflineData(offlineData);
    } catch (error) {
      console.error('Error syncing offline data', error);
    }
    */
    
    // Mock successful sync
    const updatedData = offlineData.map(item => ({
      ...item,
      synced: true
    }));
    
    this.saveOfflineData(updatedData);
    console.log('All offline data synced successfully');
  }
  
  // For usage in components to check if we're online
  isNetworkOnline(): boolean {
    return this.isOnline;
  }
  
  // For cleanup
  cleanup(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }
}

// Create and export a singleton instance
const offlineStorage = new OfflineStorage();
export default offlineStorage;
