// lib/firebase/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/config'; // authオブジェクトの正しいパスを確認してください
import { onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { auth, currentUser, loading };
};
