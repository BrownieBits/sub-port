'use client';

import { Separator } from '@/components/ui/separator';
import cartStore from '@/stores/cartStore';
import { faCircle as faCircleRegular } from '@fortawesome/free-regular-svg-icons';
import { faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CheckoutSteps() {
  const cart_loaded = cartStore((state) => state.cart_loaded);
  const cart_address = cartStore((state) => state.address);
  const shipments_ready = cartStore((state) => state.shipments_ready);

  if (!cart_loaded) {
    return <></>;
  }
  return (
    <section className="flex w-[200px] items-center gap-2 md:w-[350px] xl:w-[400px]">
      <aside className="jusitify-center flex flex-col items-center gap-2">
        <>
          {cart_address !== undefined ? (
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
          {cart_address !== undefined ? (
            <p className="text-primary text-xs">Address</p>
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
          {cart_address === undefined && (
            <p className="text-md text-muted-foreground md:text-xl">
              <FontAwesomeIcon className="icon" icon={faCircleRegular} />
            </p>
          )}
          {cart_address !== undefined && !shipments_ready && (
            <p className="text-md text-foreground md:text-xl">
              <FontAwesomeIcon className="icon" icon={faCircle} />
            </p>
          )}
          {cart_address !== undefined && shipments_ready && (
            <p className="text-md text-primary md:text-xl">
              <FontAwesomeIcon className="icon" icon={faCircleCheck} />
            </p>
          )}
        </>
        <>
          {cart_address === undefined && (
            <p className="text-muted-foreground text-xs">Shipping</p>
          )}
          {cart_address !== undefined && !shipments_ready && (
            <p className="text-foreground text-xs">Shipping</p>
          )}
          {cart_address !== undefined && shipments_ready && (
            <p className="text-primary text-xs">Shipping</p>
          )}
        </>
      </aside>
      <aside className="w-auto flex-1">
        <Separator />
      </aside>
      <aside className="jusitify-center flex flex-col items-center gap-2">
        <>
          {(cart_address === undefined || !shipments_ready) && (
            <p className="text-md text-muted-foreground md:text-xl">
              <FontAwesomeIcon className="icon" icon={faCircleRegular} />
            </p>
          )}
          {cart_address !== undefined && shipments_ready && (
            <p className="text-md text-foreground md:text-xl">
              <FontAwesomeIcon className="icon" icon={faCircle} />
            </p>
          )}
        </>
        <>
          {(cart_address === undefined || !shipments_ready) && (
            <p className="text-muted-foreground text-xs">Payment</p>
          )}
          {cart_address !== undefined && shipments_ready && (
            <p className="text-foreground text-xs">Payment</p>
          )}
        </>
      </aside>
    </section>
  );
}
