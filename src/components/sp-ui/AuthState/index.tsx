'use client';

import { auth, db } from '@/lib/firebase';
import { _SetUserProps } from '@/lib/types';
import userStore from '@/stores/userStore';
import { deleteCookie, setCookie } from 'cookies-next/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  onSnapshot,
} from 'firebase/firestore';

export default function AuthState() {
  const setUser = userStore((state) => state.setUser);
  const clearUser = userStore((state) => state.clearUser);
  const setUserLoaded = userStore((state) => state.setUserLoaded);
  const setProductLikes = userStore((state) => state.setProductLikes);
  const setStoreSubscribes = userStore((state) => state.setStoreSubscribes);
  const setCommentLikes = userStore((state) => state.setCommentLikes);

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
    const productLikesRef: CollectionReference = collection(
      db,
      `users/${user.uid}/likes`
    );
    const storeSubscribesRef: CollectionReference = collection(
      db,
      `users/${user.uid}/subscribes`
    );
    const commentLikesRef: CollectionReference = collection(
      db,
      `users/${user.uid}/comment_likes`
    );
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
          tos_agreed: doc.data().tos_agreed,
        };
        setUser(data);
        SetCookies(data);
        setUserLoaded(true);
      }
    });
    await onSnapshot(productLikesRef, (data) => {
      if (!data.empty) {
        const likeIDs: string[] = [];
        data.forEach((doc) => {
          likeIDs.push(doc.id);
        });
        setProductLikes(likeIDs);
      } else {
        setProductLikes([]);
      }
    });
    await onSnapshot(storeSubscribesRef, (data) => {
      if (!data.empty) {
        const subscribeIDs: string[] = [];
        data.forEach((doc) => {
          subscribeIDs.push(doc.id);
        });
        setStoreSubscribes(subscribeIDs);
      } else {
        setStoreSubscribes([]);
      }
    });
    await onSnapshot(commentLikesRef, (data) => {
      if (!data.empty) {
        const likeIDs: string[] = [];
        data.forEach((doc) => {
          likeIDs.push(doc.id);
        });
        setCommentLikes(likeIDs);
      } else {
        setCommentLikes([]);
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
      setUserLoaded(true);
    }
  });

  return <></>;
}
