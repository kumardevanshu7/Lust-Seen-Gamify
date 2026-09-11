import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  Firestore,
  serverTimestamp,
} from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { GameState } from "@/types/game";

// Firebase credentials loaded from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAge8YM6Cd91gjxD-JWibujHFOEvdCYHk4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "pro7-lustseen.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "pro7-lustseen",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "pro7-lustseen.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "396218617176",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:396218617176:web:1d994fa3b2348ce667e92d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GT1PSNPG24",
};

// Singleton initialization to prevent multiple instances during Next.js hot-reloads
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Safe Analytics (runs only in browser window)
let analyticsInstance: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional fallback
  });
}
export { analyticsInstance as analytics };

// Authentication Helpers
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInAsGuest(): Promise<User> {
  const result = await signInAnonymously(auth);
  return result.user;
}

export async function logOutFirebase(): Promise<void> {
  await signOut(auth);
}

// Cloud Firestore Sync Helpers
export async function saveGameStateToCloud(uid: string, gameState: GameState): Promise<void> {
  try {
    const userDocRef = doc(db, "users", uid);
    // Remove undefined values to ensure Firestore compliance
    const sanitizedState = JSON.parse(JSON.stringify(gameState));
    await setDoc(
      userDocRef,
      {
        ...sanitizedState,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Firestore sync warning (falling back to local cache):", error);
  }
}

export async function loadGameStateFromCloud(uid: string): Promise<GameState | null> {
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as GameState;
    }
  } catch (error) {
    console.warn("Firestore load warning:", error);
  }
  return null;
}

export function subscribeToCloudGameState(uid: string, onUpdate: (data: GameState) => void) {
  const userDocRef = doc(db, "users", uid);
  return onSnapshot(
    userDocRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as GameState);
      }
    },
    (err) => {
      console.warn("Firestore listener warning:", err);
    }
  );
}

export { onAuthStateChanged };
export type { User };
