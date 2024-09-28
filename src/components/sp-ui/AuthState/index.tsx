'use client';

import { auth, db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import { _SetUserProps } from '@/stores/userStore.types';
import { deleteCookie, setCookie } from 'cookies-next';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, DocumentReference, onSnapshot } from 'firebase/firestore';

export default function AuthState() {
  const setUser = userStore((state) => state.setUser);
  const clearUser = userStore((state) => state.clearUser);
  const setUserLoaded = userStore((state) => state.setUserLoaded);

  async function SetCookies(user_info: _SetUserProps) {
    const today = new Date();
    const expires = new Date(today.setMonth(today.getMonth() + 3));
    setCookie('user_id', user_info.user_id, {
      secure: true,
      expires: expires,
    });
    setCookie('default_store', user_info.user_store, {
      secure: true,
      expires: expires,
    });
    setCookie('user_email', user_info.user_email, {
      secure: true,
      expires: expires,
    });
  }

  async function getUserData(
    user: User,
    setUser: (props: _SetUserProps) => void
  ) {
    const userDataRef: DocumentReference = doc(db, 'users', user.uid);
    await onSnapshot(userDataRef, (doc) => {
      if (doc.exists()) {
        const data: _SetUserProps = {
          user_id: user.uid,
          user_email: doc.data().email,
          user_name: doc.data().name,
          user_role: doc.data().role,
          user_plan: doc.data().plan,
          user_country: doc.data().country,
          user_currency: doc.data().default_currency,
          user_store: doc.data().default_store,
        };
        setUser(data);
        SetCookies(data);
      }
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      getUserData(user, setUser);
    } else {
      clearUser();
      deleteCookie('user_id');
      deleteCookie('default_store');
      deleteCookie('user_email');
    }
    setUserLoaded(true);
  });

  return <></>;
}
