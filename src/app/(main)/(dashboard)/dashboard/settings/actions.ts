'use server';

import { revalidatePath } from 'next/cache';

export async function revalidate() {
  'use server';
  revalidatePath(`/dashboard/settings`);
}

type Address = {
  email: string;
  name: string;
  phone: string | null | undefined;
  address_line1: string;
  address_line2?: string;
  city_locality: string;
  state_province: string;
  postal_code: string;
  country_code: string;
};

export async function validateAddress(address: Address) {
  'use server';
  const result = await fetch(
    'https://api.shipengine.com/v1/addresses/validate',
    {
      body: JSON.stringify([address]),
      headers: {
        'API-Key': process.env.USPS_ADDRESS_API_KEY!,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  );
  const resultJSON = await result.json();
  return resultJSON;
}
