import { Logo } from '@/components/sp-ui/Logo';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { SignUpForm } from './signUpForm';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Sign Up`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/`,
      title: `Sign Up`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Sign Up`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function SignUp(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const country = (await headers()).get('x-geo-country') as string;
  const city = (await headers()).get('x-geo-city') as string;
  const region = (await headers()).get('x-geo-region') as string;
  const ip = (await headers()).get('x-ip') as string;

  let redirectLink = '';
  if (searchParams && Object.keys(searchParams).length > 0) {
    redirectLink = '?';
    Object.keys(searchParams).map((key, index) => {
      redirectLink += `${key}=${searchParams?.redirect as string}`;
      if (index !== Object.keys(searchParams).length - 1) {
        redirectLink += `&`;
      }
    });
  }

  return (
    <section className="flex w-full flex-col justify-between">
      <section className="flex w-full items-center justify-between">
        <section className="w-[45px] md:w-[150px]">
          <Logo url="/" />
        </section>
        <section className="">
          <section className="">
            Already have an account?{' '}
            <Link href={`/sign-in${redirectLink}`} className="font-bold">
              Sign In
            </Link>
          </section>
        </section>
      </section>
      <section className="flex w-full flex-col items-center justify-center">
        <h1 className="mb-4">Sign Up</h1>
        <SignUpForm country={country} city={city} region={region} ip={ip} />
      </section>
      <section className="h-[53px] w-full md:h-[61px]"></section>
    </section>
  );
}
