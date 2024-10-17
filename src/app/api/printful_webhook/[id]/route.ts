import { NextRequest } from 'next/server';

type Params = {
  id: string;
};

export async function POST(request: NextRequest, context: { params: Promise<Params> }) {
  const data = await request.json();
  console.log('REQUEST', data.data.sync_product.id);
  if (data.type === 'product_updated') {
    const syncResponse = await fetch(
      `https://api.printful.com/store/products/${data.data.sync_product.id}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer 7mFSBeY8lylaUlibKaR2wMDvlWocLuLzTFhEho0I`,
        },
      }
    );
    console.log('SYNC RESP', syncResponse);
    const syncJson = await syncResponse.json();
    console.log('SYNC JSON', syncJson);
  }

  return new Response('Success!', {
    status: 200,
  });
}
