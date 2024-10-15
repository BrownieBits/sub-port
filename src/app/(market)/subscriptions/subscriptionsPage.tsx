'use client';

import StoreCard from '@/components/sp-ui/StoreCard';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import userStore from '@/stores/userStore';
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import React from 'react';
import { noUserRedirect } from './actions';
import { NoSubscriptions } from './noSubscriptions';

type Store = {
  name: string;
  avatar_url: string;
  subscription_count: number;
  id: string;
};

export function StoreSubscriptions() {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const [storeData, setStoreData] = React.useState<Store[] | null>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  async function getStores() {
    const subsciptionsRef: CollectionReference = collection(
      db,
      `users/${user_id}/subscribes`
    );
    const subscriptionsData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(subsciptionsRef);
    if (subscriptionsData.empty) {
      setStoreData([]);
      return;
    }
    const store_ids = subscriptionsData.docs.map((store) => store.id);

    const storesRef: CollectionReference = collection(db, 'stores');
    const q = query(
      storesRef,
      where('__name__', 'in', store_ids),
      where('password_protected', '==', false),
      orderBy('created_at', 'desc')
    );
    const storesData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(q);
    if (!storesData.empty) {
      const stores: Store[] = storesData.docs.map((store) => {
        return {
          id: store.id,
          name: store.data().name,
          subscription_count: store.data().subscription_count,
          avatar_url: store.data().avatar_url,
        };
      });
      setStoreData(stores);
    } else {
      setStoreData([]);
    }
  }
  React.useEffect(() => {
    if (user_id !== '') {
      getStores();
    }
  }, [user_id]);

  if (user_loaded && user_id === '') {
    noUserRedirect();
  }

  if (!user_loaded || storeData == null) {
    return (
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="grid grid-cols-2 gap-x-8 gap-y-[60px] px-4 py-8 md:grid-cols-4 xl:grid-cols-6">
          <section className="group flex w-full flex-col items-center justify-center gap-4">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full">
              <Skeleton className="aspect-square h-full w-full rounded-full" />
            </div>
            <section className="flex w-full flex-col items-center justify-center gap-1">
              <Skeleton className="h-[28px] w-[200px] rounded" />
              <Skeleton className="h-[24px] w-[150px] rounded" />
            </section>
          </section>
        </section>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[2428px]">
      {storeData.length === 0 ? (
        <NoSubscriptions />
      ) : (
        <section className="grid grid-cols-2 gap-x-8 gap-y-[60px] px-4 py-8 md:grid-cols-4 xl:grid-cols-6">
          {storeData?.map((doc) => (
            <StoreCard
              id={doc.id}
              name={doc.name}
              avatar_url={doc.avatar_url}
              subscription_count={doc.subscription_count}
              key={`new-stores-${doc.id}`}
            />
          ))}
        </section>
      )}
    </section>
  );
}
