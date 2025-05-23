'use client';

import ProductCard from '@/components/sp-ui/ProductCard';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useMediaQuery } from '@/hooks/use-media-query';
import { db } from '@/lib/firebase';
import { _GridProduct } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React from 'react';

export default function RelatedProducts(props: {
  product_id: string;
  store_id: string;
  tags: string[];
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [related, setRelated] = React.useState<_GridProduct[]>([]);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  React.useEffect(() => {
    const getItems = async () => {
      const itemsRef: CollectionReference = collection(db, 'products');
      let itemsQuery = query(itemsRef);
      if (props.tags.length > 0) {
        itemsQuery = query(
          itemsRef,
          or(
            where('store_id', '==', props.store_id),
            where('tags', 'array-contains-any', props.tags)
          )
        );
      } else {
        itemsQuery = query(itemsRef, where('store_id', '==', props.store_id));
      }
      itemsQuery = query(itemsQuery, orderBy('revenue'));
      const itemsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(itemsQuery);

      const products: _GridProduct[] = itemsData.docs.map((product) => {
        return {
          name: product.data().name,
          images: product.data().images,
          product_type: product.data().product_type,
          price: product.data().price,
          compare_at: product.data().compare_at,
          currency: product.data().currency,
          like_count: product.data().like_count,
          store_id: product.data().store_id,
          created_at: new Date(product.data().created_at.seconds * 1000),
          id: product.id,
        };
      });
      setRelated(products);
    };
    getItems();
  }, []);
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (related.length === 0) {
    return <></>;
  }

  if (isDesktop) {
    return (
      <section className="flex w-full flex-col gap-4 pb-4">
        <h3>You Might Also Like</h3>
        {related?.map((doc) => {
          if (doc.id !== props.product_id) {
            return (
              <ProductCard product={doc} show_creator={true} key={doc.id} />
            );
          }
        })}
      </section>
    );
  }
  return (
    <section className="flex w-full flex-col gap-4 pb-4">
      <h3>You Might Also Like</h3>
      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {related?.map((doc) => {
            if (doc.id !== props.product_id) {
              return (
                <CarouselItem key={doc.id}>
                  <ProductCard product={doc} show_creator={true} key={doc.id} />
                </CarouselItem>
              );
            }
          })}
        </CarouselContent>
      </Carousel>
      <div className="flex w-full justify-center gap-2">
        {[...Array(count).keys()].map((dot, index) => {
          return (
            <section
              className={cn('h-[10px] w-[10px] rounded', {
                'bg-primary': index === current - 1,
                'bg-muted': index !== current - 1,
              })}
              onClick={() => {
                api?.scrollTo(index);
              }}
              key={`related-dot-${index}`}
            ></section>
          );
        })}
      </div>
    </section>
  );
}
