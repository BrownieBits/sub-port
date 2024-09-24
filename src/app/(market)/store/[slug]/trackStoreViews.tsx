'use client';

import { analytics, db } from '@/lib/firebase';
import { getCookie } from 'cookies-next';
import { logEvent } from 'firebase/analytics';
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';
import React from 'react';

export default function TrackStoreViews(props: {
  store_id: string;
  store_name: string;
  country: string;
  city: string;
  region: string;
  ip: string;
}) {
  const user_id = getCookie('user_id');

  async function getAndSetAnalytics() {
    const analyticsColRef: CollectionReference = collection(
      db,
      `stores/${props.store_id}/analytics`
    );
    const ip = props.ip === 'undefined' ? '0.0.0.0' : props.ip;
    const now = new Date();
    const threeHoursAgo = new Date(now.getHours() - 3);
    const q = query(
      analyticsColRef,
      where('ip', '==', ip),
      where('store_id', '==', props.store_id),
      where('created_at', '<', Timestamp.fromDate(threeHoursAgo))
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const storeRef: DocumentReference = doc(db, 'stores', props.store_id);
      await addDoc(analyticsColRef, {
        type: 'store_view',
        store_id: props.store_id,
        user_id: user_id !== undefined ? user_id : null,
        country: props.country === 'undefined' ? 'SW' : props.country,
        city: props.city === 'undefined' ? 'Mos Eisley' : props.city,
        region: props.region === 'undefined' ? 'TAT' : props.region,
        ip: props.ip === 'undefined' ? '0.0.0.0' : props.ip,
        created_at: Timestamp.fromDate(new Date()),
      });

      await runTransaction(db, async (transaction) => {
        const storeDoc = await transaction.get(storeRef);
        if (!storeDoc.exists()) {
          return;
        }
        const newSubs = storeDoc.data().view_count + 1;
        transaction.update(storeRef, { view_count: newSubs });
      });
    }
  }
  React.useEffect(() => {
    if (analytics !== null) {
      logEvent(analytics, 'store_viewed', {
        store_id: props.store_id,
      });
      logEvent(analytics, 'page_view', {
        title: `${props.store_name} Store`,
      });
    }
    getAndSetAnalytics();
  }, []);
  return <></>;
}
