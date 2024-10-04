'use client';

import { Logo } from '@/components/sp-ui/Logo';
import { Separator } from '@/components/ui/separator';
import { Item, Promotion } from '@/lib/types';
import cartStore from '@/stores/cartStore';
import userStore from '@/stores/userStore';
import { faCircle as faCircleRegular } from '@fortawesome/free-regular-svg-icons';
import { faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import AddressForm from './address/addressForm';
import LoginForm from './loginForm';
import PaymentForm from './payment/paymentForm';
import RemovedItemsDialogue from './removedItemsDialogue';
import SelectedSummary from './selectedSummary';
import ShippingSelect from './shipping/shippingForm';
import CheckoutSummary from './summary';

type Items = {
  [key: string]: {
    store_name: string;
    store_avatar: string;
    items: Item[];
  };
};
type Promotions = {
  [key: string]: Promotion;
};
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
  const [step, setStep] = React.useState<string>('address');
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
          {userID !== '' && (
            <section className="flex w-[200px] items-center gap-2 md:w-[350px] xl:w-[400px]">
              <aside className="jusitify-center flex flex-col items-center gap-2">
                <>
                  {step !== 'address' && step !== 'edit_address' ? (
                    <p className="text-md text-primary md:text-xl">
                      <FontAwesomeIcon className="icon" icon={faCircleCheck} />
                    </p>
                  ) : (
                    <p className="text-md md:text-xl">
                      <FontAwesomeIcon className="icon" icon={faCircle} />
                    </p>
                  )}
                </>
                <>
                  {step !== 'address' && step !== 'edit_address' ? (
                    <p className="text-xs text-primary">Address</p>
                  ) : (
                    <p className="text-xs">Address</p>
                  )}
                </>
              </aside>
              <aside className="w-auto flex-1">
                <Separator />
              </aside>
              <aside className="jusitify-center flex flex-col items-center gap-2">
                <>
                  {(step === 'address' || step === 'edit_address') && (
                    <p className="text-md text-muted-foreground md:text-xl">
                      <FontAwesomeIcon
                        className="icon"
                        icon={faCircleRegular}
                      />
                    </p>
                  )}
                  {step === 'shipping' && (
                    <p className="text-md text-foreground md:text-xl">
                      <FontAwesomeIcon className="icon" icon={faCircle} />
                    </p>
                  )}
                  {step === 'payment' && (
                    <p className="text-md text-primary md:text-xl">
                      <FontAwesomeIcon className="icon" icon={faCircleCheck} />
                    </p>
                  )}
                </>
                <>
                  {(step === 'address' || step === 'edit_address') && (
                    <p className="text-xs text-muted-foreground">Shipping</p>
                  )}
                  {step === 'shipping' && (
                    <p className="text-xs text-foreground">Shipping</p>
                  )}
                  {step === 'payment' && (
                    <p className="text-xs text-primary">Shipping</p>
                  )}
                </>
              </aside>
              <aside className="w-auto flex-1">
                <Separator />
              </aside>
              <aside className="jusitify-center flex flex-col items-center gap-2">
                <>
                  {(step === 'address' ||
                    step === 'edit_address' ||
                    step === 'shipping') && (
                    <p className="text-md text-muted-foreground md:text-xl">
                      <FontAwesomeIcon
                        className="icon"
                        icon={faCircleRegular}
                      />
                    </p>
                  )}
                  {step === 'payment' && (
                    <p className="text-md text-foreground md:text-xl">
                      <FontAwesomeIcon className="icon" icon={faCircle} />
                    </p>
                  )}
                </>
                <>
                  {(step === 'address' || step === 'shipping') && (
                    <p className="text-xs text-muted-foreground">Payment</p>
                  )}
                  {step === 'payment' && (
                    <p className="text-xs text-foreground">Payment</p>
                  )}
                </>
              </aside>
            </section>
          )}
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
