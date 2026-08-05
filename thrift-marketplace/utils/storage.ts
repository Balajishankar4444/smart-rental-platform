// utils/storage.ts

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

export class FirebaseStorageService {
  static async uploadFile(fileBuffer: Buffer, filePath: string, contentType: string): Promise<string> {
    const storageRef = ref(storage, filePath);
    const metadata = { contentType };
    
    await uploadBytes(storageRef, fileBuffer, metadata);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  }

  static async deleteFile(filePath: string): Promise<void> {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  }
}