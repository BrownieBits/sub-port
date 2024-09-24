'use client';
import { Separator } from '@/components/ui/separator';
import { getCookie } from 'cookies-next';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { connectToPrintful } from './actions';

export default function Printful() {
  const user_id = getCookie('user_id');

  const searchParams = useSearchParams();
  const state = searchParams.get('state');
  const code = searchParams.get('code');
  const success = searchParams.get('success');
  const [status, setStatus] = React.useState('Connecting');
  // Get success param... 1 is good 0 is bad
  // if success=1 get code and state.
  // Check state = userid
  // if state=userid send post to url below
  // https://www.printful.com/oauth/token
  React.useEffect(() => {
    const connect = async () => {
      const resp = await connectToPrintful(code!, user_id!);
      setStatus(resp);
    };
    if (success !== '1') {
      setStatus('Unsuccessful Connection. Try Again');
    } else if (state !== user_id) {
      setStatus('Wrong User State');
    } else {
      connect();
    }
  }, []);
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Printful</h1>
        </section>
      </section>
      <Separator />
      <p>
        <b>{status}</b>
      </p>
    </section>
  );
}
