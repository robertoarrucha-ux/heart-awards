
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const config = {
  "projectId": "apex-vote",
  "appId": "1:1000187502600:web:484c82caba35678911f1bd",
  "storageBucket": "apex-vote.appspot.com",
  "apiKey": "AIzaSyDUuijmmVD5M3Gh2T-dR3t72yGrrdsc0-I",
  "authDomain": "apex-vote.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1000187502600"
};

const app = initializeApp(config);
const db = getFirestore(app);

async function listCollections() {
  console.log("Listing all documents in key collections to find admin data...");
  
  const collections = ['users', 'admins', 'config', 'settings'];
  
  for (const col of collections) {
    console.log(`\nCollection: ${col}`);
    try {
      const snapshot = await getDocs(collection(db, col));
      if (snapshot.empty) {
        console.log("Empty.");
        continue;
      }
      snapshot.forEach(doc => {
        console.log(`ID: ${doc.id}, Data:`, doc.data());
      });
    } catch (e) {
      console.log(`Could not read ${col} (might not exist).`);
    }
  }
}

listCollections().catch(console.error);
