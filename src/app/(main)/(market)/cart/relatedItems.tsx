'use client';

import ProductCard from '@/components/sp-ui/ProductCard';
import { db } from '@/lib/firebase';
import { GridProduct } from '@/lib/types';
import cartStore from '@/stores/cartStore';
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import React from 'react';

export default function RelatedItems() {
  const cart_items = cartStore((state) => state.store_item_breakdown);
  const [related, setRelated] = React.useState<GridProduct[]>([]);

  const getItems = async () => {
    const store_ids = Object.keys(cart_items!);

    if (store_ids.length > 0) {
      const relatedRef: CollectionReference = collection(db, 'products');
      const relatedQuery = query(
        relatedRef,
        where('store_id', 'in', store_ids),
        where('revenue', '>=', 0),
        where('status', '==', 'Public'),
        orderBy('revenue'),
        limit(8)
      );
      const relatedData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(relatedQuery);

      const products: GridProduct[] = relatedData.docs.map((product) => {
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
        };
      });
      setRelated(products);
    } else {
      setRelated([]);
    }
  };

  React.useEffect(() => {
    if (cart_items !== undefined) {
      getItems();
    }
  }, [cart_items]);

  if (related.length === 0) {
    return <></>;
  }
  return (
    <section className="flex w-full flex-col gap-4">
      <h3>You might like</h3>
      <section className="grid grid-cols-1 gap-8 md:grid-cols-3 xl:grid-cols-6">
        {related?.map((doc) => (
          <ProductCard product={doc} show_creator={true} key={doc.id} />
        ))}
      </section>
    </section>
  );
}
