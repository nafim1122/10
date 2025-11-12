import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // If firebase wasn't configured (dev .env missing), avoid calling
    // firebase methods which would throw and prevent the app from rendering.
    if (!auth) {
      setInitializing(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  const login = (email, password) => {
    if (!auth) return Promise.reject(new Error('Firebase not configured'));
    return signInWithEmailAndPassword(auth, email, password);
  };
  // register and set displayName/photoURL
  const register = async (email, password, displayName, photoURL) => {
    if (!auth) return Promise.reject(new Error('Firebase not configured'));
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName || photoURL) {
      await updateProfile(userCred.user, { displayName: displayName || undefined, photoURL: photoURL || undefined });
      // refresh the auth currentUser
    }
    return userCred;
  };
  const logout = () => {
    if (!auth) return Promise.reject(new Error('Firebase not configured'));
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
