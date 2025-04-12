'use server';

import { _Address, _Item, _Rate, _ShippingCarrier } from '@/lib/types';

export async function getSelfShipping(
  items: _Item[],
  ship_to: _Address,
  ship_from: _Address,
  carriers: _ShippingCarrier[]
) {
  'use server';
  const carrier_ids = carriers.map((carrier) => {
    return carrier.carrier_id;
  });

  const weight = {
    value: 0,
    unit: 'pound'
  }
  const dimensions = {
    height: 0,
    width: 0,
    length: 0,
    unit: 'inch'
  }

  items.map((product) => {
    if (product.dimensions !== null && product.dimensions !== undefined) {
      if (parseFloat(product.dimensions.length as unknown as string) > parseFloat(dimensions.length as unknown as string)) {
        dimensions.length = product.dimensions?.length;
      }
      if (parseFloat(product.dimensions.height as unknown as string) > parseFloat(dimensions.height as unknown as string)) {
        dimensions.height = product.dimensions?.height;
      }
      if (parseFloat(product.dimensions.width as unknown as string) > parseFloat(dimensions.width as unknown as string)) {
        dimensions.width = product.dimensions?.width;
      }
      dimensions.unit = product.dimensions?.units;
    }
    if (product.weight !== null && product.weight !== undefined) {
      weight.value += product.weight?.value;
      weight.unit = product.weight?.units;
    }
  })

  const result = await fetch('https://api.shipengine.com/v1/rates/estimate', {
    body: JSON.stringify({
      carrier_ids: carrier_ids,

      from_country_code: ship_from.country_code,
      from_postal_code: ship_from.postal_code,
      from_city_locality: ship_from.city_locality,
      from_state_province: ship_from.state_province,

      to_country_code: ship_to.country_code,
      to_postal_code: ship_to.postal_code,
      to_city_locality: ship_to.city_locality,
      to_state_province: ship_to.state_province,

      weight: weight,
      dimensions: dimensions,

      confirmation: 'none',
      address_residential_indicator: ship_to.address_residential_indicator,
      ship_date: new Date(),
    }),
    headers: {
      'API-Key': process.env.USPS_API_KEY!,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  const resultJSON = await result.json();

  const rates: _Rate[] = resultJSON.map((rate: any) => {
    if (rate.shipping_amount !== null) {
      return {
        carrier_name: rate.carrier_friendly_name,
        carrier_id: rate.carrier_id,
        delivery_days: rate.delivery_days,
        estimated_delivery_date: new Date(rate.estimated_delivery_date),
        rate:
          parseFloat(rate.confirmation_amount.amount) +
          parseFloat(rate.insurance_amount.amount) +
          parseFloat(rate.requested_comparison_amount.amount) +
          parseFloat(rate.shipping_amount.amount) * 100,
        service_code: rate.service_code,
        service_type: rate.service_type,
        package_type: rate.package_type,
      };
    }
  });
  return rates;
}

export async function getCarriers() {
  'use server';
  const result = await fetch('https://api.shipengine.com/v1/carriers', {
    headers: {
      'API-Key': process.env.USPS_API_KEY!,
      'Content-Type': 'application/json',
    },
  });
  const resultJSON = await result.json();
  return resultJSON;
}

export async function getPrintfulRates(token: string, items: _Item[],
  ship_to: _Address,) {
  const shipment_items = items.map((item) => {
    return {
      variant_id: item.vendor_id,
      quantity: item.quantity
    }
  })
  const response = await fetch(`https://api.printful.com/shipping/rates`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        "recipient": {
          "address1": ship_to.address_line1,
          "city": ship_to.city_locality,
          "country_code": ship_to.country_code,
          "state_code": ship_to.state_province,
          "zip": ship_to.postal_code,
          "phone": ship_to.phone
        },
        "items": shipment_items,
        "locale": "en_US"
      }),
    }
  );
  const responseJson = await response.json();

  if (responseJson.code !== 200) {
    console.log('RESP JSON ERROR', responseJson)
    return [];
  }
  const rates: _Rate[] = responseJson.result.map((rate: any) => {
    if (rate.shipping_amount !== null) {
      return {
        carrier_name: 'Printful',
        carrier_id: rate.id,
        delivery_days: rate.maxDeliveryDays,
        estimated_delivery_date: new Date(rate.maxDeliveryDate),
        rate: parseFloat(rate.rate) * 100,
        service_code: rate.name,
        service_type: rate.name,
        package_type: '',
      };
    }
  });
  return rates;

}