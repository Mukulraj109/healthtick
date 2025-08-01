import { db } from '../firebase';
import { Client } from '../types';

export class ClientService {
  private collection = db.collection('clients');

  async getAllClients(): Promise<Client[]> {
    const snapshot = await this.collection.orderBy('name').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Client));
  }

  async initializeClients(): Promise<void> {
    const existingClients = await this.getAllClients();
    if (existingClients.length > 0) return;

    const clients: Omit<Client, 'id'>[] = [
      { name: 'Emma Johnson', phone: '+1-555-0101' },
      { name: 'Liam Williams', phone: '+1-555-0102' },
      { name: 'Olivia Brown', phone: '+1-555-0103' },
      { name: 'Noah Davis', phone: '+1-555-0104' },
      { name: 'Ava Miller', phone: '+1-555-0105' },
      { name: 'William Wilson', phone: '+1-555-0106' },
      { name: 'Sophia Moore', phone: '+1-555-0107' },
      { name: 'James Taylor', phone: '+1-555-0108' },
      { name: 'Isabella Anderson', phone: '+1-555-0109' },
      { name: 'Benjamin Thomas', phone: '+1-555-0110' },
      { name: 'Mia Jackson', phone: '+1-555-0111' },
      { name: 'Lucas White', phone: '+1-555-0112' },
      { name: 'Charlotte Harris', phone: '+1-555-0113' },
      { name: 'Henry Martin', phone: '+1-555-0114' },
      { name: 'Amelia Thompson', phone: '+1-555-0115' },
      { name: 'Alexander Garcia', phone: '+1-555-0116' },
      { name: 'Harper Martinez', phone: '+1-555-0117' },
      { name: 'Michael Robinson', phone: '+1-555-0118' },
      { name: 'Evelyn Clark', phone: '+1-555-0119' },
      { name: 'Daniel Rodriguez', phone: '+1-555-0120' }
    ];

    const batch = db.batch();
    clients.forEach(client => {
      const docRef = this.collection.doc();
      batch.set(docRef, client);
    });

    await batch.commit();
    console.log('✅ Initialized 20 clients in Firestore');
  }
}