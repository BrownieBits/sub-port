'use server';
import { _Address } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function revalidate() {
  'use server';
  revalidatePath(`/checkout`);
}

export async function validateAddress(address: _Address) {
  'use server';
  const result = await fetch(
    'https://api.shipengine.com/v1/addresses/validate',
    {
      body: JSON.stringify({
        address_line1: address.address_line1,
        address_line2: address.address_line2,
        city_locality: address.city_locality,
        state_province: address.state_province,
        postal_code: address.postal_code,
        country_code: address.country_code,
        phone: address.phone,
        name: address.name,
        email: address.email,
      }),
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
