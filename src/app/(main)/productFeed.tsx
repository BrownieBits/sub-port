'use client';

import { NewStores } from '@/components/sp-ui/HomePageSections/newStores';
import { HomepageProducts } from '@/components/sp-ui/HomePageSections/products';
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
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useInView } from 'react-intersection-observer';

type Section = {
  id: string;
  type: string;
  order: number;
  size?: number;
  status: string;
  banner_url?: string;
  banner_alt?: string;
  banner_width?: number;
  banner_height?: number;
  banner_link?: string;
  products?: GridProduct[];
};

export function ProductFeed() {
  const [sectionsData, setSectionsData] = React.useState<Section[]>([]);
  const [moreProducts, setMoreProducts] = React.useState<GridProduct[]>([]);
  const [lastDoc, setLastDoc] = React.useState<DocumentData | null>(null);
  const [lastProduct, setLastProduct] = React.useState<
    DocumentData | undefined
  >(undefined);
  const { ref, inView } = useInView();
  let start = 0;

  async function getProducts(size?: number, last_product?: DocumentData) {
    const productssRef: CollectionReference = collection(db, 'products');
    let q = query(
      productssRef,
      where('status', '==', 'Public'),
      orderBy('created_at', 'desc')
    );
    if (last_product !== undefined) {
      q = query(q, startAfter(last_product));
    }
    if (size !== undefined) {
      q = query(q, limit(size));
    } else {
      q = query(q, limit(96));
    }

    const productsDocs: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(q);

    return productsDocs.docs;
  }
  async function getSections() {
    const sectionsRef: CollectionReference = collection(
      db,
      'homepage_sections'
    );
    let q = query(
      sectionsRef,
      where('status', '==', 'Public'),
      orderBy('order', 'asc')
    );
    if (lastDoc !== null) {
      q = query(q, startAfter(lastDoc));
    }
    q = query(q, limit(4));

    const sectionDocs: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(q);

    if (!sectionDocs.empty) {
      let newSections: Section[] = sectionDocs.docs.map((section): Section => {
        return {
          id: section.id,
          type: section.data().type,
          order: section.data().order,
          size: section.data().size,
          status: section.data().status,
          banner_url: section.data().banner_url,
          banner_alt: section.data().banner_alt,
          banner_width: section.data().banner_width,
          banner_height: section.data().banner_height,
          banner_link: section.data().banner_link,
        };
      });
      let last_product = lastProduct;
      for (const section of newSections) {
        if (section.type === 'products') {
          const products = await getProducts(section.size, last_product);
          last_product = products[products.length - 1];
          const gridProducts: GridProduct[] = products.map((product) => {
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
              revenue: product.data().revenue,
              view_count: product.data().view_count,
            };
          });
          section.products = gridProducts;
        }
        const newSection = [section];
      }
      if (sectionDocs.size === 4) {
        setLastDoc(sectionDocs.docs[sectionDocs.size - 1]);
      } else {
        setLastDoc(null);
      }
      setLastProduct(last_product);
      setSectionsData([...sectionsData, ...newSections]);
    } else {
      setLastDoc(null);
    }
  }

  React.useEffect(() => {
    getSections();
  }, []);
  React.useEffect(() => {
    if (inView) {
      getSections();
    }
  }, [inView]);

  return (
    <section className="w-full px-4 py-4">
      {/* {lastProduct !== undefined && <p>lastProducts</p>} */}
      {sectionsData.map((section) => {
        if (section.type === 'products') {
          return (
            <HomepageProducts
              products={section.products!}
              lastProduct={section.size !== undefined ? undefined : lastProduct}
              key={`home_section_${section.id}`}
            />
          );
        }
        if (section.type === 'new_stores') {
          return <NewStores key={`home_section_${section.id}`} />;
        }
        if (section.type === 'banner') {
          return (
            <Link
              href={section.banner_link!}
              key={`home_section_${section.id}`}
            >
              <Image
                src={section.banner_url!}
                width={section.banner_width!}
                height={section.banner_height!}
                alt="boop"
              />
            </Link>
          );
        }
      })}

      {lastDoc !== null && <div ref={ref}>Loading...</div>}
    </section>
  );
}
