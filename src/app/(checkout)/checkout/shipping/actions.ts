'use server';

import { ShippingCarrier } from '@/lib/types';
import { _Address, _CartFullItem, _Rate } from '@/stores/cartStore.types';
import { Timestamp } from 'firebase/firestore';

export async function getSelfShipping(
  items: _CartFullItem[],
  ship_to: _Address,
  ship_from: _Address,
  carriers: ShippingCarrier[]
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

  items.map((item) => {
    if (item.dimensions !== null && item.dimensions !== undefined) {
      dimensions.height = item.dimensions?.height;
      dimensions.length = item.dimensions?.length;
      dimensions.width = item.dimensions?.width;
      dimensions.unit = item.dimensions?.units;
    }
    if (item.weight !== null && item.weight !== undefined) {
      weight.value += item.weight?.value;
      weight.unit = item.weight?.units;
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
        estimated_delivery_date: Timestamp.fromDate(new Date(rate.estimated_delivery_date)),
        rate:
          parseFloat(rate.confirmation_amount.amount) +
          parseFloat(rate.insurance_amount.amount) +
          parseFloat(rate.requested_comparison_amount.amount) +
          parseFloat(rate.shipping_amount.amount),
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
