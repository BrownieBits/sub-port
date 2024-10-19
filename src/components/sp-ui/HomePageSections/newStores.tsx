'use client';

import StoreCard from '@/components/sp-ui/StoreCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { db } from '@/lib/firebase';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
} from 'firebase/firestore';
import React from 'react';

type Store = {
  name: string;
  avatar_url: string;
  subscription_count: number;
  id: string;
};

export function NewStores() {
  const [storeData, setStoreData] = React.useState<Store[] | null>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  async function getStores() {
    const storesRef: CollectionReference = collection(db, 'stores');
    const q = query(storesRef, orderBy('created_at', 'desc'), limit(6));
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
      // id,avatar_url,name,subscription_count
    }
  }
  React.useEffect(() => {
    getStores();
  }, []);

  if (storeData == null) {
    return <></>;
  }

  if (isDesktop) {
    return (
      <section className="w-full px-4 py-4">
        <p className="text-2xl font-bold">New Stores</p>
        <section className="grid grid-cols-1 gap-8 py-4 md:grid-cols-3 xl:grid-cols-6">
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
    );
  }

  return (
    <section className="w-full px-4 py-4">
      <p className="text-2xl font-bold">New Stores</p>
      <Carousel
        opts={{ loop: true }}
        className="mx-auto w-[calc(100%-100px)] py-4"
      >
        <CarouselContent>
          {storeData?.map((doc) => (
            <CarouselItem key={`new-stores-${doc.id}`}>
              <StoreCard
                id={doc.id}
                name={doc.name}
                avatar_url={doc.avatar_url}
                subscription_count={doc.subscription_count}
                key={`new-stores-${doc.id}`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
