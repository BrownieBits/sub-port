'use client';

import { auth, db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCookie, setCookie } from 'cookies-next';
import { User } from 'firebase/auth';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  Timestamp,
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { Button } from '../../ui/button';

export const CartIcon = () => {
  const cart_id = getCookie('cart_id');
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [cartID, setCartID] = React.useState<string>('');
  const [itemCount, setItemCount] = React.useState<number>(0);
  // const [user, setUser] = React.useState<User | null>(null);

  function setCartCookie(newCartID: string) {
    const today = new Date();
    const expires = new Date(today.setMonth(today.getMonth() + 1));
    setCookie('cart_id', newCartID, {
      secure: true,
      expires: expires,
    });
  }

  async function createNewCart(email?: string, user_id?: string) {
    const cartsReference: CollectionReference = collection(db, 'carts');
    const cartsDoc: DocumentReference = doc(cartsReference);
    if (email !== undefined && user_id !== undefined) {
      await setDoc(cartsDoc, {
        owner_id: user_id,
        owner_email: email,
        items: 0,
        created_at: Timestamp.fromDate(new Date()),
      });
    }

    setCartCookie(cartsDoc.id);
    setCartID(cartsDoc.id);
    setLoaded(true);
  }

  async function updateCartToUserCart(email: string, user_id: string) {
    const cartRef: DocumentReference = doc(db, 'carts', cart_id!);
    const cartsDoc = await getDoc(cartRef);
    if (cartsDoc.exists()) {
      await updateDoc(cartRef, {
        owner_id: user_id,
        owner_email: email,
        updated_at: Timestamp.fromDate(new Date()),
      });
    } else {
      await setDoc(cartRef, {
        owner_id: user_id,
        owner_email: email,
        items: 0,
        created_at: Timestamp.fromDate(new Date()),
      });
    }
    setCartCookie(cart_id!);
    setCartID(cart_id!);
    setLoaded(true);
  }

  async function checkUserCarts(user: User) {
    const userCartsReference: CollectionReference = collection(db, 'carts');
    const q = query(
      userCartsReference,
      where('owner_id', '==', user?.uid),
      limit(1)
    );
    const userCartsData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(q);
    if (userCartsData.empty) {
      if (cart_id === undefined) {
        createNewCart(user?.email!, user.uid);
      } else {
        updateCartToUserCart(user?.email!, user.uid);
      }
    } else {
      if (cart_id === userCartsData.docs[0].id) {
        setCartID(cart_id!);
        setCartCookie(cart_id!);
      } else {
        const cartRef: DocumentReference = doc(db, 'carts', cart_id!);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          if (cartDoc.data().items > 0) {
            const deleteRef: DocumentReference = doc(
              db,
              'carts',
              userCartsData.docs[0].id
            );
            await deleteDoc(deleteRef);
            setCartCookie(cartDoc.id);
            setCartID(cartDoc.id);
          } else {
            await deleteDoc(cartRef);
            setCartCookie(userCartsData.docs[0].id);
            setCartID(userCartsData.docs[0].id);
          }
        } else {
          setCartCookie(userCartsData.docs[0].id);
          setCartID(userCartsData.docs[0].id);
        }
      }
    }
  }

  async function checkIfUserCart() {
    const cartsRef: DocumentReference = doc(db, 'carts', cart_id!);
    const cartDoc = await getDoc(cartsRef);

    if (cartDoc.exists()) {
      if (cartDoc.data().owner_id === null) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  React.useEffect(() => {
    auth.onAuthStateChanged(async function handleAuth(user) {
      if (user) {
        checkUserCarts(user);
      } else {
        if (cart_id === undefined) {
          createNewCart();
        } else {
          const is_user_cart: boolean = await checkIfUserCart();
          if (is_user_cart) {
            createNewCart();
          } else {
            setCartID(cart_id);
          }
        }
      }
    });
  }, []);

  React.useEffect(() => {
    const getLatest: Unsubscribe = async () => {
      const cartRef: DocumentReference = doc(db, `carts/`, cartID);
      const unsubscribe = await onSnapshot(cartRef, (snapshot) => {
        if (!snapshot.exists()) {
          setItemCount(0);
        } else {
          setItemCount(snapshot.data().items);
        }
      });
      return unsubscribe;
    };
    if (cartID != '') {
      getLatest();
    }
  }, [cartID]);

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="bg-layer-one hover:bg-layer-two"
    >
      <Link href="/cart" aria-label="Cart" title="Cart">
        <FontAwesomeIcon
          icon={faCartShopping}
          className={cn('h-4 w-4', {
            'mr-4': itemCount > 0,
          })}
        />
        {itemCount > 0 && <p>{itemCount}</p>}
      </Link>
    </Button>
  );
};
