'use client';

import { analytics, db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import { subHours } from 'date-fns';
import { logEvent } from 'firebase/analytics';
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import React from 'react';

export default function TrackCheckout(props: {
  store_ids: string[];
  country: string;
  city: string;
  region: string;
  ip: string;
}) {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);

  async function getAndSetAnalytics() {
    const batch = writeBatch(db);
    await Promise.all(
      props.store_ids.map(async (store) => {
        const analyticsColRef: CollectionReference = collection(
          db,
          `stores/${store}/analytics`
        );
        const now = new Date();
        const threeHoursAgo = subHours(now, 3);
        const q = query(
          analyticsColRef,
          where('ip', '==', props.ip),
          where('type', '==', 'checkout_reached'),
          where('created_at', '>', Timestamp.fromDate(threeHoursAgo))
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          const analyticsDoc: DocumentReference = doc(analyticsColRef);
          batch.set(analyticsDoc, {
            type: 'checkout_reached',
            store_id: store,
            user_id: user_id !== '' ? user_id : null,
            country: props.country,
            city: props.city,
            region: props.region,
            ip: props.ip,
            created_at: Timestamp.fromDate(new Date()),
          });
        }
      })
    );
    await batch.commit();
  }
  React.useEffect(() => {
    if (user_loaded) {
      if (analytics !== null) {
        logEvent(analytics, 'page_view', {
          title: `Checkout - SubPort Creator Platform`,
        });
      }
      getAndSetAnalytics();
    }
  }, [user_loaded]);
  return <></>;
}
