'use server';

import { redirect } from "next/navigation";

export async function connectToPrintful(code: string, store_id: string) {
  const tokenResponse = await fetch('https://www.printful.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_PRINTFUL_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_PRINTFUL_SECRET_KEY,
      code: code,
    }),
  });
  const tokenJson = await tokenResponse.json();
  if (tokenResponse.status !== 200) {
    return { error: tokenJson.error.message, status: tokenResponse.status };
  }
  console.log('TokenJson', tokenJson);
  const webhookeResponse = await fetch('https://api.printful.com/webhooks', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${tokenJson.access_token}`,
    },
    body: JSON.stringify({
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/api/printful_webhook/${store_id}`,
      types: [
        'package_shipped',
        'package_returned',
        'order_created',
        'order_updated',
        'order_failed',
        'order_canceled',
        'order_refunded',
        'product_synced',
        'product_updated',
        'product_deleted',
      ],
    }),
  });
  const webHookJson = await webhookeResponse.json();

  if (webhookeResponse.status !== 200) {
    return { error: webHookJson.error.message, status: webhookeResponse.status };
  }
  console.log('ACCESS TOKEN', tokenJson.access_token);
  console.log('WEBHOOK STATUS', webhookeResponse.status);
  console.log('WEBHOOK', webhookeResponse);
  return { status: 200, access_token: tokenJson.access_token, refresh_token: tokenJson.refresh_token };
}

export async function goToIntegrations() {
  'use server'
  redirect('/dashboard/integrations');
}
