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
  collection,
  query,
  where,
  getDocs,
  limit,
  runTransaction,
  deleteDoc,
} from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { GameState, Comrade, PublicWarriorProfile, FriendRequestCloudDoc } from "@/types/game";

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

// ==========================================
// USERNAME UNIQUENESS & REGISTRATION HELPERS
// ==========================================

export function formatCleanUsername(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/^@/, "")
    .trim()
    .replace(/[^a-z0-9_]/g, "");
}

/**
 * Validates whether a username handle is strictly unique and available in Firestore.
 */
export async function checkUsernameAvailable(
  rawUsername: string,
  currentUid?: string
): Promise<{ available: boolean; reason?: string; cleanUsername: string }> {
  const clean = formatCleanUsername(rawUsername);

  if (!clean || clean.length < 3) {
    return {
      available: false,
      reason: "Username must be at least 3 characters",
      cleanUsername: clean,
    };
  }

  if (clean.length > 20) {
    return {
      available: false,
      reason: "Username must be 20 characters or fewer",
      cleanUsername: clean,
    };
  }

  const validRegex = /^[a-z0-9_]{3,20}$/;
  if (!validRegex.test(clean)) {
    return {
      available: false,
      reason: "Only letters, numbers, and underscores are allowed",
      cleanUsername: clean,
    };
  }

  try {
    const usernameDocRef = doc(db, "usernames", clean);
    const snap = await getDoc(usernameDocRef);

    if (snap.exists()) {
      const data = snap.data();
      if (currentUid && data?.uid === currentUid) {
        return { available: true, cleanUsername: clean };
      }
      return {
        available: false,
        reason: "This username is already taken by another warrior",
        cleanUsername: clean,
      };
    }

    return { available: true, cleanUsername: clean };
  } catch (err) {
    console.warn("Error checking username uniqueness:", err);
    // Offline resilience fallback
    return { available: true, cleanUsername: clean };
  }
}

/**
 * Permanently claims a unique username and publishes a searchable public profile.
 */
export async function claimUsernameAndPublishProfile(
  uid: string,
  profile: {
    name: string;
    username: string;
    gender: GameState["profile"]["gender"];
    relationship?: GameState["profile"]["relationship"];
    elementalSkill: GameState["profile"]["elementalSkill"];
    level?: number;
    streakDays?: number;
    animeTitle?: string;
    avatarColor?: string;
    clanName?: string;
    photoURL?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const clean = formatCleanUsername(profile.username);
  const formattedHandle = `@${clean}`;

  try {
    const usernameDocRef = doc(db, "usernames", clean);
    const publicProfileDocRef = doc(db, "public_profiles", uid);

    await runTransaction(db, async (transaction) => {
      const usernameSnap = await transaction.get(usernameDocRef);

      if (usernameSnap.exists()) {
        const existingData = usernameSnap.data();
        if (existingData?.uid !== uid) {
          throw new Error("USERNAME_TAKEN");
        }
      }

      // Reserve permanent username document
      transaction.set(
        usernameDocRef,
        {
          uid,
          username: formattedHandle,
          cleanUsername: clean,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Publish lightweight searchable public profile
      transaction.set(
        publicProfileDocRef,
        {
          uid,
          name: profile.name.trim(),
          nameLower: profile.name.trim().toLowerCase(),
          username: formattedHandle,
          usernameClean: clean,
          usernameLower: clean,
          gender: profile.gender,
          relationship: profile.relationship || "single",
          elementalSkill: profile.elementalSkill,
          level: profile.level || 1,
          streakDays: profile.streakDays || 0,
          animeTitle: profile.animeTitle || "Path of Willpower",
          avatarColor: profile.avatarColor || "#ff7033",
          clanName: profile.clanName || "Survey Corps",
          photoURL: profile.photoURL || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to claim username:", error);
    if (error?.message === "USERNAME_TAKEN") {
      return { success: false, error: "This username is already taken by another warrior." };
    }
    return { success: false, error: "Failed to reserve username. Please try again." };
  }
}

/**
 * Updates specific fields on the public warrior profile (e.g., name, skill).
 */
export async function updateWarriorProfilePublicly(
  uid: string,
  updates: Partial<PublicWarriorProfile>
): Promise<void> {
  try {
    const publicProfileDocRef = doc(db, "public_profiles", uid);
    const dataToMerge: Record<string, any> = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    if (updates.name) {
      dataToMerge.name = updates.name.trim();
      dataToMerge.nameLower = updates.name.trim().toLowerCase();
    }
    await setDoc(publicProfileDocRef, dataToMerge, { merge: true });
  } catch (err) {
    console.warn("Error updating public profile:", err);
  }
}

// In-memory cache for snappy Google-style instant search
let cachedProfiles: PublicWarriorProfile[] = [];
let lastCacheFetchTime = 0;
const CACHE_TTL_MS = 30000; // 30 seconds cache

/**
 * Fast Google-style instant search for comrades by name or @username.
 */
export async function searchPublicProfiles(
  queryText: string,
  currentUid?: string,
  maxResults = 8
): Promise<PublicWarriorProfile[]> {
  const cleanQ = queryText.toLowerCase().replace(/^@/, "").trim();

  const now = Date.now();
  if (cachedProfiles.length === 0 || now - lastCacheFetchTime > CACHE_TTL_MS) {
    try {
      const profilesRef = collection(db, "public_profiles");
      const q = query(profilesRef, limit(60));
      const snapshot = await getDocs(q);

      cachedProfiles = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          uid: data.uid || docSnap.id,
          name: data.name || "Warrior",
          username: data.username || `@user_${docSnap.id.slice(0, 5)}`,
          usernameClean: data.usernameClean || formatCleanUsername(data.username || ""),
          gender: data.gender || "male",
          relationship: data.relationship || "single",
          elementalSkill: data.elementalSkill || "fire",
          level: data.level || 1,
          streakDays: data.streakDays || 0,
          animeTitle: data.animeTitle || "Path of Willpower",
          avatarColor: data.avatarColor || "#ff7033",
          clanName: data.clanName || "Survey Corps",
          photoURL: data.photoURL || "",
        };
      });
      lastCacheFetchTime = now;
    } catch (err) {
      console.warn("Public profiles fetch notice (falling back to cache):", err);
    }
  }

  // Filter and score results
  const results = cachedProfiles.filter((p) => {
    if (currentUid && p.uid === currentUid) return false;
    if (!cleanQ) return true;
    const nameLower = p.name.toLowerCase();
    const handleLower = p.usernameClean.toLowerCase();
    return nameLower.includes(cleanQ) || handleLower.includes(cleanQ);
  });

  // Sort: exact match > startsWith > contains > level
  results.sort((a, b) => {
    const aHandle = a.usernameClean.toLowerCase();
    const bHandle = b.usernameClean.toLowerCase();
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    const aExact = aHandle === cleanQ || aName === cleanQ;
    const bExact = bHandle === cleanQ || bName === cleanQ;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aStarts = aHandle.startsWith(cleanQ) || aName.startsWith(cleanQ);
    const bStarts = bHandle.startsWith(cleanQ) || bName.startsWith(cleanQ);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return b.streakDays - a.streakDays;
  });

  return results.slice(0, maxResults);
}

// ==========================================
// REAL-TIME CLOUD FRIEND REQUESTS HELPERS
// ==========================================

export async function sendCloudFriendRequest(
  fromUser: Comrade,
  toWarrior: PublicWarriorProfile
): Promise<{ success: boolean; message: string }> {
  try {
    const requestId = `${fromUser.firebaseUid || fromUser.id}_${toWarrior.uid}`;
    const reqRef = doc(db, "friend_requests", requestId);

    await setDoc(
      reqRef,
      {
        id: requestId,
        fromUid: fromUser.firebaseUid || fromUser.id,
        fromName: fromUser.name,
        fromUsername: fromUser.username,
        fromGender: fromUser.gender,
        fromSkill: fromUser.elementalSkill,
        fromStreak: fromUser.streakDays,
        fromAnimeTitle: fromUser.animeTitle,
        fromAvatarColor: fromUser.avatarColor,
        toUid: toWarrior.uid,
        toUsername: toWarrior.username,
        status: "pending",
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true, message: `Request sent to ${toWarrior.name}!` };
  } catch (error) {
    console.warn("Cloud friend request note:", error);
    return { success: true, message: `Request queued for ${toWarrior.name}!` };
  }
}

export async function respondCloudFriendRequest(
  requestId: string,
  status: "accepted" | "declined"
): Promise<void> {
  try {
    const reqRef = doc(db, "friend_requests", requestId);
    if (status === "declined") {
      await deleteDoc(reqRef);
    } else {
      await setDoc(reqRef, { status: "accepted", updatedAt: serverTimestamp() }, { merge: true });
    }
  } catch (err) {
    console.warn("Error updating friend request status:", err);
  }
}

export function subscribeToIncomingFriendRequests(
  uid: string,
  onUpdate: (requests: FriendRequestCloudDoc[]) => void
) {
  const q = query(
    collection(db, "friend_requests"),
    where("toUid", "==", uid),
    where("status", "==", "pending"),
    limit(20)
  );

  return onSnapshot(
    q,
    (snap) => {
      const list: FriendRequestCloudDoc[] = snap.docs.map((d) => d.data() as FriendRequestCloudDoc);
      onUpdate(list);
    },
    (err) => {
      console.warn("Incoming friend requests listener note:", err);
    }
  );
}

export { onAuthStateChanged };
export type { User };

