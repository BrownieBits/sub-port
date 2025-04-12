'use client';
import ProductCard from '@/components/sp-ui/ProductCard';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { _GridProduct } from '@/lib/types';
import userStore from '@/stores/userStore';
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  query,
  QuerySnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { noUserRedirect } from './actions';
import { NoLikes } from './noLikes';

export default function MyLikesPage() {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const product_likes = userStore((state) => state.product_likes);
  const [products, setProducts] = React.useState<_GridProduct[] | null>(null);
  const [lastProduct, setLastProduct] = React.useState<
    DocumentData | undefined
  >(undefined);
  const { ref, inView } = useInView();

  async function GetProducts() {
    if (product_likes.length > 0) {
      const productsRef: CollectionReference = collection(db, 'products');
      let productsQuery = query(
        productsRef,
        where('__name__', 'in', product_likes),
        where('status', '==', 'Public')
      );
      if (lastProduct !== undefined) {
        productsQuery = query(productsQuery, startAfter(lastProduct));
      }
      productsQuery = query(productsQuery, limit(96));

      const productData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(productsQuery);

      if (productData.size === 96) {
        setLastProduct(productData.docs[productData.size - 1]);
      } else {
        setLastProduct(undefined);
      }

      const gridProducts: _GridProduct[] = [];
      if (productData.empty) {
        if (products === undefined) {
          setProducts([]);
        }
      } else {
        productData.docs.map((product) => {
          gridProducts.push({
            name: product.data().name as string,
            images: product.data().images as string[],
            product_type: product.data().product_type as string,
            price: product.data().price as number,
            compare_at: product.data().compare_at as number,
            currency: product.data().currency as string,
            like_count: product.data().like_count as number,
            store_id: product.data().store_id as string,
            created_at: new Date(product.data().created_at.seconds * 1000),
            id: product.id as string,
          });
        });
        if (products === null) {
          setProducts([...gridProducts]);
        } else {
          setProducts([...products, ...gridProducts]);
        }
      }
    } else {
      setProducts([]);
    }
  }
  React.useEffect(() => {
    if (user_loaded) {
      GetProducts();
    }
  }, [user_loaded, product_likes]);
  React.useEffect(() => {
    if (inView) {
      GetProducts();
    }
  }, [inView]);

  if (user_loaded && user_id === '') {
    noUserRedirect();
  }
  if (!user_loaded || products === null) {
    return (
      <>
        <section className="mx-auto w-full max-w-[2428px]">
          <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
            <h1>My Likes</h1>
          </section>
        </section>
        <Separator />
        <section className="mx-auto w-full max-w-[2428px]">
          <section className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6">
            <section className="flex w-full flex-col">
              <Skeleton className="aspect-square w-full" />
              <section className="flex w-full gap-4 pt-4">
                <aside className="flex flex-1 justify-between">
                  <section className="flex flex-col gap-1">
                    <section className="flex flex-col gap-1">
                      <Skeleton className="h-[28px] w-[250px]" />
                      <Skeleton className="h-[20px] w-[150px]" />
                    </section>
                    <section className="text-muted-foreground text-sm">
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
                    <section className="text-muted-foreground text-sm">
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
                    <section className="text-muted-foreground text-sm">
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
        </section>
      </>
    );
  }
  if (products.length === 0) {
    return <NoLikes />;
  }
  return (
    <>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>My Likes</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6">
          {products?.map((doc) => (
            <ProductCard product={doc} show_creator={true} key={doc.id} />
          ))}
        </section>
      </section>
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
                  <section className="text-muted-foreground text-sm">
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
                  <section className="text-muted-foreground text-sm">
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
                  <section className="text-muted-foreground text-sm">
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
