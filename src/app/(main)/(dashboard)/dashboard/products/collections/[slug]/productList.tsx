'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { _GridProduct } from '@/lib/types';
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
import Image from 'next/image';
import React from 'react';

export function ProductList(props: {
  store_id: string;
  product_list?: string[];
  tag_list?: string[];
}) {
  const [products, setProducts] = React.useState<_GridProduct[] | undefined>(
    undefined
  );

  async function getProducts() {
    if (props.product_list !== undefined && props.product_list.length === 0) {
      setProducts([]);
      return;
    }
    if (props.tag_list !== undefined && props.tag_list.length === 0) {
      setProducts([]);
      return;
    }
    const productssRef: CollectionReference = collection(db, 'products');
    let q = query(
      productssRef,
      where('store_id', '==', props.store_id),
      orderBy('created_at', 'desc')
    );
    if (props.product_list !== undefined) {
      q = query(q, where('__name__', 'in', props.product_list));
    }
    if (props.tag_list !== undefined) {
      q = query(q, where('tags', 'array-contains-any', props.tag_list));
    }
    const productsDocs: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(q);

    if (productsDocs.empty) {
      if (products === undefined) {
        setProducts([]);
      }
    } else {
      const gridProducts: _GridProduct[] = productsDocs.docs.map((product) => {
        return {
          name: product.data().name,
          images: product.data().images,
          product_type: product.data().product_type,
          price: product.data().price,
          compare_at: product.data().compare_at,
          currency: product.data().currency,
          like_count: product.data().like_count,
          store_id: product.data().store_id,
          created_at: product.data().created_at,
          id: product.id,
          revenue: product.data().revenue,
          view_count: product.data().view_count,
          status: product.data().status,
        };
      });

      setProducts([...gridProducts]);
    }
  }
  React.useEffect(() => {
    getProducts();
  }, []);
  React.useEffect(() => {
    getProducts();
  }, [props.product_list]);
  React.useEffect(() => {
    getProducts();
  }, [props.tag_list]);

  if (products === undefined) {
    return (
      <section className="flex flex-col gap-4">
        <section className="flex items-center gap-4">
          <Skeleton className="aspect-square w-[50px]" />
          <section className="grid flex-1 grid-cols-4 gap-4">
            <section className="col-span-4 truncate font-bold md:col-span-2">
              <Skeleton className="h-[24px] w-[250px]" />
            </section>
            <section className="col-span-3 flex-1 truncate md:col-span-1">
              <Skeleton className="h-[24px] w-[100px]" />
            </section>
            <section className="col-span-1 flex items-center justify-end">
              <Skeleton className="h-[20px] w-[50px]" />
            </section>
          </section>
        </section>
        <section className="flex items-center gap-4">
          <Skeleton className="aspect-square w-[50px]" />
          <section className="grid flex-1 grid-cols-4 gap-4">
            <section className="col-span-4 truncate font-bold md:col-span-2">
              <Skeleton className="h-[24px] w-[250px]" />
            </section>
            <section className="col-span-3 flex-1 truncate md:col-span-1">
              <Skeleton className="h-[24px] w-[100px]" />
            </section>
            <section className="col-span-1 flex items-center justify-end">
              <Skeleton className="h-[20px] w-[50px]" />
            </section>
          </section>
        </section>
        <section className="flex items-center gap-4">
          <Skeleton className="aspect-square w-[50px]" />
          <section className="grid flex-1 grid-cols-4 gap-4">
            <section className="col-span-4 truncate font-bold md:col-span-2">
              <Skeleton className="h-[24px] w-[250px]" />
            </section>
            <section className="col-span-3 flex-1 truncate md:col-span-1">
              <Skeleton className="h-[24px] w-[100px]" />
            </section>
            <section className="col-span-1 flex items-center justify-end">
              <Skeleton className="h-[20px] w-[50px]" />
            </section>
          </section>
        </section>
      </section>
    );
  }
  if (products.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <p>This collection is empty.</p>
      </section>
    );
  }
  return (
    <>
      <section className="flex flex-col gap-4">
        {products?.map((doc) => (
          <section
            className="flex items-center gap-4"
            key={`product_${doc.id}`}
          >
            <section className="flex aspect-square w-[50px] items-center justify-center overflow-hidden border">
              <Image
                alt={doc.name}
                src={doc.images[0]}
                width="50"
                height="50"
              />
            </section>
            <section className="grid flex-1 grid-cols-4 gap-4">
              <p className="col-span-4 truncate font-bold md:col-span-2">
                {doc.name}
              </p>
              <p className="col-span-3 flex-1 truncate md:col-span-1">
                {doc.product_type}
              </p>
              <section className="col-span-1 flex items-center justify-end">
                {doc.status === 'Public' ? (
                  <span className="bg-success text-success-foreground mr-2 rounded px-2.5 py-0.5 text-xs font-medium">
                    {doc.status}
                  </span>
                ) : (
                  <span className="bg-destructive text-destructive-foreground mr-2 rounded px-2.5 py-0.5 text-xs font-medium">
                    {doc.status}
                  </span>
                )}
              </section>
            </section>
          </section>
        ))}
      </section>
    </>
  );
}
