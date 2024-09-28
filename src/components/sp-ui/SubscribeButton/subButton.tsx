'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CollectionReference,
  Timestamp,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  runTransaction,
  setDoc,
} from 'firebase/firestore';
import React, { useState } from 'react';
import { revalidate } from './actions';

type Props = {
  store_id: string;
  full_width: boolean;
  country: string;
  city: string;
  region: string;
  ip: string;
};

export const SubButton = (props: Props) => {
  const user_id = userStore((state) => state.user_id);
  const [isSubbed, setIsSubbed] = React.useState<boolean | null>(null);
  const [thinking, setThinking] = useState(false);

  async function UpdateSubStatus(action: 'Subscribe' | 'Unsubscribe') {
    setThinking(true);
    const analyticsColRef: CollectionReference = collection(
      db,
      `stores/${props.store_id}/analytics`
    );
    const docRef = doc(db, 'stores', props.store_id);
    const subRef = doc(db, 'users', user_id, 'subscribes', props.store_id);
    if (action === 'Subscribe') {
      await runTransaction(db, async (transaction) => {
        const storeDoc = await transaction.get(docRef);
        if (!storeDoc.exists()) {
          return;
        }
        const newSubs = storeDoc.data().subscription_count + 1;
        transaction.update(docRef, { subscription_count: newSubs });
      });
      await setDoc(subRef, {
        date: Timestamp.fromDate(new Date()),
      });
      await addDoc(analyticsColRef, {
        city: props.city,
        country: props.country,
        created_at: Timestamp.fromDate(new Date()),
        ip: props.ip,
        region: props.region,
        store_id: props.store_id,
        type: 'subscribe',
        user_id: user_id !== undefined ? user_id : null,
      });
    } else {
      await runTransaction(db, async (transaction) => {
        const storeDoc = await transaction.get(docRef);
        if (!storeDoc.exists()) {
          return;
        }
        const newSubs = storeDoc.data().subscription_count - 1;
        transaction.update(docRef, { subscription_count: newSubs });
      });
      await addDoc(analyticsColRef, {
        city: props.city,
        country: props.country,
        created_at: Timestamp.fromDate(new Date()),
        ip: props.ip,
        region: props.region,
        store_id: props.store_id,
        type: 'unsubscribe',
        user_id: user_id,
      });
      await deleteDoc(subRef);
    }
    revalidate(`/store/${props.store_id}`);
    setThinking(false);
  }

  React.useEffect(() => {
    const getIsSubbed: Unsubscribe = async () => {
      const docRef = doc(db, 'users', user_id, 'subscribes', props.store_id);
      const unsubscribe = await onSnapshot(docRef, (snapshot) => {
        if (!snapshot.exists()) {
          setIsSubbed(false);
        } else {
          setIsSubbed(true);
        }
      });
      return unsubscribe;
    };
    getIsSubbed();
  }, []);

  if (isSubbed === null || thinking) {
    return (
      <Button variant="ghost" className={props.full_width ? 'w-full' : ''}>
        <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faSpinner} spin />{' '}
        Loading
      </Button>
    );
  }
  let changeValue: 'Subscribe' | 'Unsubscribe' = 'Subscribe';
  if (isSubbed) {
    changeValue = 'Unsubscribe';
  }
  return (
    <Button
      variant={!isSubbed ? 'default' : 'outline'}
      className={props.full_width ? 'w-full' : ''}
      onClick={async () => {
        await UpdateSubStatus(changeValue);
      }}
    >
      {changeValue}
    </Button>
  );
};
