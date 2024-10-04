'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import cartStore from '@/stores/cartStore';
import { addDays, format } from 'date-fns';
import EditAddress from './address/editAddress';
import EditBillingAddress from './address/editBillingAddress';

export default function SelectedSummary() {
  const cart_address = cartStore((state) => state.address);
  const cart_billing_address = cartStore((state) => state.billing_address);
  const shipments_ready = cartStore((state) => state.shipments_ready);
  const shipments = cartStore((state) => state.shipments);
  const setShipmentsReady = cartStore((state) => state.setShipmentsReady);

  if (cart_address === undefined) {
    return <></>;
  }
  return (
    <Card>
      <CardContent className="p-0">
        <section className="flex items-center gap-4 p-4">
          <p className="w-[75px] text-sm text-muted-foreground">Contact</p>
          <p className="flex-1 truncate">{cart_address.email?.toUpperCase()}</p>
          <EditAddress address={cart_address} />
        </section>
        <Separator />
        <section className="flex items-center gap-4 p-4">
          <p className="w-[75px] text-sm text-muted-foreground">Ship Address</p>
          <p className="flex-1 truncate">
            {cart_address.address_line1} {cart_address.address_line2}{' '}
            {cart_address.city_locality}, {cart_address.state_province}{' '}
            {cart_address.postal_code}
          </p>
          <EditAddress address={cart_address} />
        </section>
        <Separator />
        <section className="flex items-center gap-4 p-4">
          <p className="w-[75px] text-sm text-muted-foreground">
            Billing Address
          </p>
          <p className="flex-1 truncate">
            {cart_billing_address?.address_line1}{' '}
            {cart_billing_address?.address_line2}{' '}
            {cart_billing_address?.city_locality},{' '}
            {cart_billing_address?.state_province}{' '}
            {cart_billing_address?.postal_code}
          </p>
          <EditBillingAddress address={cart_billing_address!} />
        </section>
        {shipments_ready && shipments !== undefined && (
          <>
            <Separator />
            <section className="flex items-center gap-4 p-4">
              <p className="w-[75px] text-sm text-muted-foreground">
                Shipment
                {Object.keys(shipments).length > 1 ? 's' : ''}
              </p>
              <section className="flex flex-1 flex-col gap-4">
                {Object.keys(shipments).map((shipment) => {
                  let date = new Date();
                  if (shipment !== 'digital') {
                    date = addDays(
                      date,
                      shipments[shipment].rate?.delivery_days!
                    );
                  }
                  return (
                    <section
                      className="flex items-center"
                      key={`selected-shipment-${shipment}`}
                    >
                      <aside className="flex flex-1 flex-col">
                        <p className="flex-1 truncate">
                          {shipments[shipment].rate?.service_type.toUpperCase()}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Estimated Delivery - {format(date, 'LLL dd')}
                        </p>
                      </aside>
                      <Button
                        variant="link"
                        size="sm"
                        className="py-0"
                        onClick={() => setShipmentsReady(false)}
                      >
                        Edit
                      </Button>
                    </section>
                  );
                })}
              </section>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}
