import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

let auth = null;
try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  }
  if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId) {
    const app = initializeApp(firebaseConfig)
    auth = getAuth(app)
  } else {
    console.warn('Firebase config missing. Auth features will be disabled in this session.')
  }
} catch (err) {
  console.warn('Firebase initialization failed. Auth features disabled:', err?.message || err)
}

export { auth }
