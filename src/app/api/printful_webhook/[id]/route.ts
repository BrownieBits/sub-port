import { db } from '@/lib/firebase';
import { collection, doc, DocumentData, getDoc, getDocs, query, QuerySnapshot, Timestamp, updateDoc, where, writeBatch } from 'firebase/firestore';
import { NextRequest } from 'next/server';

type Params = {
  id: string;
};
type VariantFile = {
  type: string;
  id: number;
  url: string;
  options: {
    id: string;
    value: String;
  }[];
  hash: string;
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number;
  status: string;
  created: number;
  thumbnail_url: string;
  preview_url: string;
  visible: boolean;
  is_temporary: boolean;
  stitch_count_tier: string;
}
type Variant = {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  retail_price: string;
  currency: string;
  is_ignored: boolean;
  sku: string;
  product: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  };
  files: VariantFile[];
  options: {
    id: string;
    value: String;
  }[];
  main_category_id: number;
  warehouse_product_id: number;
  warehouse_product_variant_id: number;
  size: string;
  color: string;
  availability_status: string;
}

export async function POST(request: NextRequest, context: { params: Promise<Params> }) {
  const data = await request.json();
  const parameters = await context.params;
  console.log('REQUEST', data.data);
  if (data.type === 'product_updated') {

    const storeRef = doc(db, 'stores', parameters.id);
    const storeDoc = await getDoc(storeRef);
    if (storeDoc.exists()) {
      const syncResponse = await fetch(
        `https://api.printful.com/sync/products/${data.data.sync_product.id}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${storeDoc.data().printful_access_token}`,
          },
        }
      );
      console.log('PRODUCT UPDATE PARAMS', parameters.id);
      console.log('SYNC RESP', syncResponse);
      const syncJson = await syncResponse.json();
      console.log('SYNC JSON', syncJson);
      if (syncJson.code === 200) {
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('vendor_id', '==', syncJson.result.sync_product.id),
        );
        const productsData: QuerySnapshot<DocumentData, DocumentData> =
          await getDocs(q);
        const batch = writeBatch(db);
        const imageURLs: string[] = [];
        let price: number = 0;
        syncJson.result.sync_variants.map((variant: Variant) => {
          if (variant.availability_status === 'active') {
            console.log(`${variant.id} Variant`, variant)
            variant.files.map((file: VariantFile) => {
              if (file.visible && file.status === 'ok') {
                imageURLs.push(file.url);
              }
              console.log(`${variant.id} File`, file)
            })
            const newPrice = parseFloat(variant.retail_price).toFixed(2) as unknown as number;
            if (price === 0 || price > newPrice) {
              price = newPrice;
            }
            console.log(`${variant.id} PRODUCT`, variant.product)

          }
        })
        if (productsData.empty) {
          const newProductDoc = doc(productsRef);
          batch.set(newProductDoc, {
            name: syncJson.result.sync_product.name,
            images: imageURLs,
            vendor: 'printful',
            vendor_id: syncJson.result.sync_product.id,
            description: '',
            price: price,
            compare_at: 0,
            currency: syncJson.result.sync_variants[0].currency,
            inventory: 0,
            track_inventory: false,
            status: 'Public',
            tags: [],
            admin_tags: [],
            like_count: 0,
            product_type: '',
            store_id: parameters.id,
            owner_id: storeDoc.data().owner_id,
            units_sold: 0,
            is_featured: false,
            created_at: Timestamp.fromDate(new Date()),
            updated_at: Timestamp.fromDate(new Date()),
            colors: [],
            sku: '',
            revenue: 0,
            view_count: 0,
            service_percent: 0.1,
          });
        } else {
          await updateDoc(productsData.docs[0].ref, {
            name: syncJson.result.sync_product.name
          })
        }
        await batch.commit();
      }

    }
  }

  return new Response('Success!', {
    status: 200,
  });
}
