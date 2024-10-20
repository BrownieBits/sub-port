'use client';

import StoreCard from '@/components/sp-ui/StoreCard';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import React from 'react';
import { useInView } from 'react-intersection-observer';
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
  const store_subscribes = userStore((state) => state.store_subscribes);
  const [storeData, setStoreData] = React.useState<Store[] | null>(null);
  const [lastStore, setLastStore] = React.useState<DocumentData | undefined>(
    undefined
  );
  const { ref, inView } = useInView();

  async function getStores() {
    if (store_subscribes.length > 0) {
      const storesRef: CollectionReference = collection(db, 'stores');
      let storesQuery = query(
        storesRef,
        where('__name__', 'in', store_subscribes),
        orderBy('created_at', 'desc')
      );
      if (lastStore !== undefined) {
        storesQuery = query(storesQuery, startAfter(lastStore));
      }
      storesQuery = query(storesQuery, limit(96));

      const storesData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(storesQuery);

      if (storesData.size === 96) {
        setLastStore(storesData.docs[storesData.size - 1]);
      } else {
        setLastStore(undefined);
      }
      const stores: Store[] = [];
      if (storesData.empty) {
        if (storeData === null) {
          setStoreData([]);
        }
      } else {
        storesData.docs.map((store) => {
          stores.push({
            id: store.id,
            name: store.data().name,
            subscription_count: store.data().subscription_count,
            avatar_url: store.data().avatar_url,
          });
        });
        if (storeData === null) {
          setStoreData([...stores]);
        } else {
          setStoreData([...storeData, ...stores]);
        }
      }
    } else {
      setStoreData([]);
    }
  }
  React.useEffect(() => {
    if (user_loaded) {
      getStores();
    }
  }, [user_loaded, store_subscribes]);
  React.useEffect(() => {
    if (inView) {
      getStores();
    }
  }, [inView]);

  if (user_loaded && user_id === '') {
    noUserRedirect();
  }

  if (!user_loaded || storeData == null) {
    return (
      <>
        <section className="mx-auto w-full max-w-[2428px]">
          <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
            <h1>My Subscriptions</h1>
          </section>
        </section>
        <Separator />
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
            <section className="group flex w-full flex-col items-center justify-center gap-4">
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full">
                <Skeleton className="aspect-square h-full w-full rounded-full" />
              </div>
              <section className="flex w-full flex-col items-center justify-center gap-1">
                <Skeleton className="h-[28px] w-[200px] rounded" />
                <Skeleton className="h-[24px] w-[150px] rounded" />
              </section>
            </section>
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
      </>
    );
  }
  if (storeData.length === 0) {
    return <NoSubscriptions />;
  }
  return (
    <>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>My Subscriptions</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
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
      </section>
      {lastStore !== undefined && (
        <section
          className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6"
          ref={ref}
        >
          <section className="group flex w-full flex-col items-center justify-center gap-4">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full">
              <Skeleton className="aspect-square h-full w-full rounded-full" />
            </div>
            <section className="flex w-full flex-col items-center justify-center gap-1">
              <Skeleton className="h-[28px] w-[200px] rounded" />
              <Skeleton className="h-[24px] w-[150px] rounded" />
            </section>
          </section>
          <section className="group flex w-full flex-col items-center justify-center gap-4">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full">
              <Skeleton className="aspect-square h-full w-full rounded-full" />
            </div>
            <section className="flex w-full flex-col items-center justify-center gap-1">
              <Skeleton className="h-[28px] w-[200px] rounded" />
              <Skeleton className="h-[24px] w-[150px] rounded" />
            </section>
          </section>
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
      )}
    </>
  );
}
