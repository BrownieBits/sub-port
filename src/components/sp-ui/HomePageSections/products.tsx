'use client';

import ProductCard from '@/components/sp-ui/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { GridProduct } from '@/lib/types';
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

type Props = {
  products: GridProduct[];
  lastProduct?: DocumentData;
};

export function HomepageProducts(props: Props) {
  const [moreProducts, setMoreProducts] = React.useState<GridProduct[]>([]);
  const [lastProduct, setLastProduct] = React.useState<
    DocumentData | undefined
  >(undefined);
  const { ref, inView } = useInView();

  async function getMoreProducts() {
    const productssRef: CollectionReference = collection(db, 'products');
    let q = query(
      productssRef,
      where('status', '==', 'Public'),
      orderBy('created_at', 'desc')
    );
    if (lastProduct !== undefined) {
      q = query(q, startAfter(lastProduct));
    }
    q = query(q, limit(96));

    const productsDocs: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(q);

    if (productsDocs.size === 96) {
      setLastProduct(productsDocs.docs[productsDocs.size - 1]);
    } else {
      setLastProduct(undefined);
    }
    const gridProducts: GridProduct[] = productsDocs.docs.map((product) => {
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
      };
    });

    setMoreProducts([...moreProducts, ...gridProducts]);
  }

  React.useEffect(() => {
    if (props.lastProduct !== undefined) {
      setLastProduct(props.lastProduct);
    }
  }, []);
  React.useEffect(() => {
    if (inView) {
      getMoreProducts();
    }
  }, [inView]);

  if (props.lastProduct === undefined) {
    return (
      <section className="grid grid-cols-1 gap-8 py-4 md:grid-cols-3 xl:grid-cols-6">
        {props.products.map((doc) => (
          <ProductCard product={doc} show_creator={true} key={doc.id} />
        ))}
      </section>
    );
  }
  return (
    <>
      <section className="grid grid-cols-1 gap-8 py-4 md:grid-cols-3 xl:grid-cols-6">
        {props.products!.map((doc) => (
          <ProductCard product={doc} show_creator={true} key={doc.id} />
        ))}
      </section>
      {moreProducts.length > 0 && (
        <section className="grid grid-cols-1 gap-8 py-4 md:grid-cols-3 xl:grid-cols-6">
          {moreProducts.map((doc) => (
            <ProductCard product={doc} show_creator={true} key={doc.id} />
          ))}
        </section>
      )}

      {lastProduct !== undefined && (
        <section
          className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6"
          ref={ref}
        >
          <section className="flex w-full flex-col">
            <Skeleton className="aspect-square w-full" />
            <section className="flex w-full gap-4 pt-4">
              <aside className="flex flex-1 justify-between">
                <section className="flex flex-col gap-1">
                  <section className="flex flex-col gap-1">
                    <Skeleton className="h-[28px] w-[250px]" />
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                  <section className="text-sm text-muted-foreground">
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                </section>
                <section>
                  <section className="flex w-full flex-col items-end gap-1">
                    <Skeleton className="h-[28px] w-[75px]" />
                  </section>
                </section>
              </aside>
            </section>
          </section>
          <section className="flex w-full flex-col">
            <Skeleton className="aspect-square w-full" />
            <section className="flex w-full gap-4 pt-4">
              <aside className="flex flex-1 justify-between">
                <section className="flex flex-col gap-1">
                  <section className="flex flex-col gap-1">
                    <Skeleton className="h-[28px] w-[250px]" />
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                  <section className="text-sm text-muted-foreground">
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                </section>
                <section>
                  <section className="flex w-full flex-col items-end gap-1">
                    <Skeleton className="h-[28px] w-[75px]" />
                  </section>
                </section>
              </aside>
            </section>
          </section>
          <section className="flex w-full flex-col">
            <Skeleton className="aspect-square w-full" />
            <section className="flex w-full gap-4 pt-4">
              <aside className="flex flex-1 justify-between">
                <section className="flex flex-col gap-1">
                  <section className="flex flex-col gap-1">
                    <Skeleton className="h-[28px] w-[250px]" />
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                  <section className="text-sm text-muted-foreground">
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                </section>
                <section>
                  <section className="flex w-full flex-col items-end gap-1">
                    <Skeleton className="h-[28px] w-[75px]" />
                  </section>
                </section>
              </aside>
            </section>
          </section>
        </section>
      )}
    </>
  );
}
