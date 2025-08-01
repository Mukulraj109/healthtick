
import { db } from './firebase'; 

async function seedClient() {
  const clientData = {
    name: 'Jane Doe',
    phone: '+91-9876543210',
  };

  const docRef = await db.collection('clients').add(clientData);
  console.log('✅ Client created with ID:', docRef.id);
}

seedClient().catch(console.error);
