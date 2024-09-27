'use client';

import { analytics, db } from '@/lib/firebase';
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
  user_id: string | undefined;
  country: string;
  city: string;
  region: string;
  ip: string;
}) {
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
            user_id: props.user_id !== undefined ? props.user_id : null,
            country: props.country === 'undefined' ? 'SW' : props.country,
            city: props.city === 'undefined' ? 'Mos Eisley' : props.city,
            region: props.region === 'undefined' ? 'TAT' : props.region,
            ip: props.ip === 'undefined' ? '0.0.0.0' : props.ip,
            created_at: Timestamp.fromDate(new Date()),
          });
        }
      })
    );
    await batch.commit();
  }
  React.useEffect(() => {
    if (analytics !== null) {
      logEvent(analytics, 'page_view', {
        title: `Checkout - SubPort Creator Platform`,
      });
    }
    getAndSetAnalytics();
  }, []);
  return <></>;
}
