'use client';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import { doc, DocumentReference, updateDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { connectToPrintful, goToIntegrations } from './actions';

export default function Printful() {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const user_store = userStore((state) => state.user_store);

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
    if (user_loaded) {
      const connect = async () => {
        const resp = await connectToPrintful(code!, user_store);
        if (resp.status !== 200) {
          toast.error('Unsuccessful Connection.', {
            description:
              'We had an issue connecting your store. Please try again.',
          });
          goToIntegrations();
          return;
        } else {
          const storeRef: DocumentReference = doc(db, 'stores', user_store);

          updateDoc(storeRef, {
            printful_access_token: resp.access_token,
            printful_refresh_token: resp.refresh_token,
          });
          toast.success('Printful Store Connected!', {
            description:
              'Your Printful store has successfully been connected to your SubPort Store.',
          });
          goToIntegrations();
          return;
        }
      };
      if (success !== '1' || state !== user_id) {
        toast.error('Unsuccessful Connection.', {
          description:
            'We had an issue connecting your store. Please try again.',
        });
        goToIntegrations();
      } else {
        connect();
      }
    }
  }, [user_loaded]);
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
