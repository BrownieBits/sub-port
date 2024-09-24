'use server';

export async function connectToPrintful(code: string, user_id: string) {
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
    return tokenJson.error.message;
  }
  console.log('TokenJson', tokenJson);
  const webhookeResponse = await fetch('https://api.printful.com/webhooks', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${tokenJson.access_token}`,
    },
    body: JSON.stringify({
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/api/printful_webhook/${user_id}`,
      types: [
        'package_shipped',
        'product_synced',
        'product_updated',
        'product_deleted',
      ],
    }),
  });
  const webHookJson = await webhookeResponse.json();

  if (webhookeResponse.status !== 200) {
    return webHookJson.error.message;
  }
  console.log('ACCESS TOKEN', tokenJson.access_token);
  console.log('WEBHOOK STATUS', webhookeResponse.status);
  console.log('WEBHOOK', webhookeResponse);
  return 'Connected!';
}
