import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getProfileFromApi, isProfileComplete, type Profile } from '@/lib/profileStore';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  profileComplete: boolean | null;
  profileLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfileStatus: (profile: Profile) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Fetch profile after user logs in to check completeness
  useEffect(() => {
    if (!user) {
      setProfileComplete(null);
      setProfileLoading(false);
      return;
    }
    let aborted = false;
    setProfileLoading(true);

    user
      .getIdToken(true)
      .then((token) => getProfileFromApi(token))
      .then((profile) => {
        if (!aborted) {
          setProfileComplete(isProfileComplete(profile));
          setProfileLoading(false);
        }
      })
      .catch(() => {
        if (!aborted) {
          setProfileComplete(false);
          setProfileLoading(false);
        }
      });

    return () => {
      aborted = true;
    };
  }, [user?.uid]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const refreshProfileStatus = useCallback((profile: Profile) => {
    setProfileComplete(isProfileComplete(profile));
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    profileComplete,
    profileLoading,
    signInWithGoogle,
    signOut,
    refreshProfileStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
