import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NextRequest } from 'next/server';

type Params = {
  id: string;
};

export async function POST(request: NextRequest, context: { params: Promise<Params> }) {
  const data = await request.json();
  const parameters = await context.params;
  console.log('REQUEST', data.data);
  if (data.type === 'product_updated') {

    const storeRef = doc(db, 'stores', parameters.id);
    const storeDoc = await getDoc(storeRef);
    if (storeDoc.exists()) {
      const syncResponse = await fetch(
        `https://api.printful.com/store/products/${data.data.sync_product.id}`,
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
    }
  }

  return new Response('Success!', {
    status: 200,
  });
}
