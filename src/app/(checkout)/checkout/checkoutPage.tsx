'use client';

import { Logo } from '@/components/sp-ui/Logo';
import { Separator } from '@/components/ui/separator';
import cartStore from '@/stores/cartStore';
import userStore from '@/stores/userStore';
import React from 'react';
import AddressForm from './address/addressForm';
import LoginForm from './loginForm';
import PaymentForm from './payment/paymentForm';
import RemovedItemsDialogue from './removedItemsDialogue';
import SelectedSummary from './selectedSummary';
import ShippingSelect from './shipping/shippingForm';
import CheckoutSteps from './steps';
import CheckoutSummary from './summary';

type Props = {
  country: string;
  city: string;
  region: string;
  ip: string;
};

export default function CheckoutPage(props: Props) {
  const cart_loaded = cartStore((state) => state.cart_loaded);
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const [userID, setUserID] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user_loaded) {
      setUserID(user_id);
    }
  }, [user_loaded, user_id]);

  if (!cart_loaded && !user_loaded) {
    return <></>;
  }
  return (
    <>
      <section className="mx-auto w-full max-w-[1200px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <section className="jusitfy-center flex flex-col items-center gap-2 md:flex-row md:justify-start">
            <section className="w-[40px] md:w-[120px]">
              <Logo url="/" />
            </section>
            <p className="md:text-md text-xs">Secure Checkout</p>
          </section>
          {userID !== '' && <CheckoutSteps />}
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[1200px]">
        <section className="flex w-full flex-col-reverse gap-4 px-4 py-4 md:flex-row">
          <aside className="flex w-full flex-1 flex-col gap-4">
            {userID !== null && userID !== '' && (
              <>
                <AddressForm user_id={userID} />
                <SelectedSummary />

                <ShippingSelect />

                <PaymentForm user_id={userID} />
              </>
            )}
          </aside>
          <CheckoutSummary />
        </section>
      </section>
      {userID === '' && (
        <LoginForm
          country={props.country}
          city={props.city}
          region={props.region}
          ip={props.ip}
          setUserID={setUserID}
        />
      )}
      <RemovedItemsDialogue />
    </>
  );
}
