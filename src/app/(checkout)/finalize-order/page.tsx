import { headers } from 'next/headers';
import FinalizeOrderPage from './finalizeOrderPage';

export default async function ThankYou() {
  const country = (await headers()).get('x-geo-country') as string;
  const city = (await headers()).get('x-geo-city') as string;
  const region = (await headers()).get('x-geo-region') as string;
  const ip = (await headers()).get('x-ip') as string;
  return (
    <section className="w-full">
      <FinalizeOrderPage
        country={country}
        city={city}
        region={region}
        ip={ip}
      />
    </section>
  );
}
