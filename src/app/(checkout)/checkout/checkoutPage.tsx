'use client';

import { Logo } from '@/components/sp-ui/Logo';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  Address,
  Item,
  Promotion,
  RemovedProduct,
  Shipments,
} from '@/lib/types';
import { faCircle as faCircleRegular } from '@fortawesome/free-regular-svg-icons';
import { faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addDays, format } from 'date-fns';
import {
  DocumentReference,
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import React from 'react';
import AddressForm from './address/addressForm';
import EditAddress from './address/editAddress';
import EditBillingAddress from './address/editBillingAddress';
import SelectVerifiedAddress from './address/selectVerifiedAddress';
import LoginForm from './loginForm';
import PaymentForm from './payment/paymentForm';
import RemovedItemsDialogue from './removedItemsDialogue';
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
  items: Items;
  promotions: Promotions;
  removed_items: RemovedProduct[];
  address: Address | undefined;
  billing_address: Address | undefined;
  shipments: Shipments | undefined;
  payment_intent: string | undefined;
  user_id?: string;
  cart_id: string;
  country: string;
  city: string;
  region: string;
  ip: string;
};

export default function CheckoutPage(props: Props) {
  const [itemsTotal, setItemsTotal] = React.useState<number>(0);
  const [serviceTotal, setServiceTotal] = React.useState<number>(0);
  const [cartTotal, setCartTotal] = React.useState<number>(0);
  const [discountsTotal, setDiscountsTotal] = React.useState<number>(0);
  const [shippingTotal, setShippingTotal] = React.useState<number | null>(null);
  const [taxesTotal, setTaxesTotal] = React.useState<number | null>(null);
  const [removedItems, setRemovedItems] = React.useState<RemovedProduct[]>([]);
  const [step, setStep] = React.useState<string>('address');
  const [userID, setUserID] = React.useState<string>('');
  const [address, setAddress] = React.useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = React.useState<Address | null>(
    null
  );
  const [shipments, setShipments] = React.useState<Shipments | null>(null);
  const [matchedAddress, setMatchedAddress] = React.useState<Address | null>(
    null
  );
  const [originalAddress, setOriginalAddress] = React.useState<Address | null>(
    null
  );
  const [matchedBillingAddress, setMatchedBillingAddress] =
    React.useState<Address | null>(null);
  const [originalBillingAddress, setOriginalBillingAddress] =
    React.useState<Address | null>(null);

  async function selectAddress(address: Address) {
    const cartDocRef: DocumentReference = doc(db, `carts`, props.cart_id);
    const cartDoc = await getDoc(cartDocRef);
    if (cartDoc.exists()) {
      await updateDoc(cartDocRef, {
        email: address.email,
        address: address,
        billing_address: billingAddress === null ? address : billingAddress,
        updated_at: Timestamp.fromDate(new Date()),
      });
    } else {
      await setDoc(cartDocRef, {
        email: address.email,
        address: address,
        billing_address: billingAddress === null ? address : billingAddress,
        created_at: Timestamp.fromDate(new Date()),
        updated_at: Timestamp.fromDate(new Date()),
      });
    }

    setAddress(address);
    if (billingAddress === null) {
      setBillingAddress(address);
    }
    setStep('shipping');
  }
  async function selectBillingAddress(address: Address) {
    const cartDocRef: DocumentReference = doc(db, `carts`, props.cart_id);
    const cartDoc = await getDoc(cartDocRef);
    if (cartDoc.exists()) {
      await updateDoc(cartDocRef, {
        billing_address: address,
        updated_at: Timestamp.fromDate(new Date()),
      });
    } else {
      await setDoc(cartDocRef, {
        email: address.email,
        address: address,
        billing_address: address,
        created_at: Timestamp.fromDate(new Date()),
        updated_at: Timestamp.fromDate(new Date()),
      });
    }
    setBillingAddress(address);
  }
  async function selectShipping(newShipments: Shipments) {
    console.log('UPDATING');
    const cartDocRef: DocumentReference = doc(db, `carts`, props.cart_id);
    const cartDoc = await getDoc(cartDocRef);

    let hasNulls = false;
    let total = 0;
    Object.keys(newShipments).map((shipment) => {
      if (newShipments[shipment].rate === null) {
        hasNulls = true;
      } else {
        total += newShipments[shipment].rate?.rate! as number;
      }
    });
    if (!hasNulls) {
      if (cartDoc.exists()) {
        await updateDoc(cartDocRef, {
          shipments: newShipments,
          updated_at: Timestamp.fromDate(new Date()),
        });
      } else {
        await setDoc(cartDocRef, {
          shipments: newShipments,
          created_at: Timestamp.fromDate(new Date()),
          updated_at: Timestamp.fromDate(new Date()),
        });
      }
    }
    setShippingTotal(total);
    setCartTotal(itemsTotal + serviceTotal + total - discountsTotal);
    setShipments(newShipments);
    setStep('payment');
  }
  async function setValidationAddresses(matched: Address, original: Address) {
    setMatchedAddress(matched);
    setOriginalAddress(original);
  }
  async function setValidationBillingAddresses(
    matched: Address,
    original: Address
  ) {
    setMatchedBillingAddress(matched);
    setOriginalBillingAddress(original);
  }

  React.useEffect(() => {
    let item_total = 0;
    let service_total = 0;
    let discounts_total = 0;
    let shipping_total = 0;
    let step = 'address';

    Object.keys(props.items).map((store) => {
      let store_total = 0;
      props.items[store].items.map((item) => {
        if (item.compare_at > 0 && item.compare_at < item.price) {
          store_total += parseFloat(item.compare_at.toString()) * item.quantity;
          item_total += parseFloat(item.compare_at.toString()) * item.quantity;
          service_total +=
            parseFloat(item.compare_at.toString()) *
            item.quantity *
            parseFloat(item.service_percent.toString());
        } else {
          store_total += parseFloat(item.price.toString()) * item.quantity;
          item_total += parseFloat(item.price.toString()) * item.quantity;
          service_total +=
            parseFloat(item.price.toString()) *
            item.quantity *
            parseFloat(item.service_percent.toString());
        }
      });
      if (props.promotions.hasOwnProperty(store)) {
        const expiration = props.promotions[store].expiration_date as Timestamp;
        let expiration_good = true;
        if (expiration !== null) {
          const expiration_date = new Date(expiration.seconds * 1000);
          const today = new Date();
          if (today.getTime() > expiration_date.getTime()) {
            expiration_good = false;
          }
        }
        let minimum_good = true;
        if (
          props.promotions[store].minimum_order_value > 0 &&
          props.promotions[store].minimum_order_value > store_total
        ) {
          minimum_good = false;
        }
        if (minimum_good && expiration_good) {
          if (props.promotions[store].type === 'Flat Amount') {
            discounts_total += props.promotions[store].amount;
          } else if (props.promotions[store].type === 'Percentage') {
            const discount_amount =
              store_total * (props.promotions[store].amount / 100);
            discounts_total += discount_amount;
          }
        }
      }
    });
    if (props.billing_address !== null && props.billing_address !== undefined) {
      setBillingAddress(props.billing_address);
    }
    if (props.address !== null && props.address !== undefined) {
      setAddress(props.address);
      step = 'shipping';
    }
    if (props.shipments !== null && props.shipments !== undefined) {
      step = 'payment';
      let hasNulls = false;
      let total = 0;
      Object.keys(props.shipments).map((shipment) => {
        if (props.shipments![shipment].rate === null) {
          hasNulls = true;
        } else {
          total += props.shipments![shipment].rate?.rate! as number;
        }
      });
      if (!hasNulls) {
        setShippingTotal(total);
        shipping_total = total;
      }
      setShipments(props.shipments);
    }

    if (props.user_id !== null && props.user_id !== undefined) {
      setUserID(props.user_id);
    }
    setStep(step);
    setRemovedItems(props.removed_items);
    setDiscountsTotal(discounts_total);
    setItemsTotal(item_total);
    setServiceTotal(service_total);
    setCartTotal(item_total + service_total + shipping_total - discounts_total);
  }, []);

  React.useEffect(() => {
    if (shippingTotal !== null) {
      let newTotal = 0;
      if (taxesTotal !== null) {
        newTotal =
          itemsTotal +
          serviceTotal +
          shippingTotal +
          taxesTotal -
          discountsTotal;
      } else {
        newTotal = itemsTotal + serviceTotal + shippingTotal - discountsTotal;
      }

      setCartTotal(newTotal);
    }
  }, [shippingTotal]);
  React.useEffect(() => {
    if (taxesTotal !== null) {
      let newTotal = 0;
      if (shippingTotal !== null) {
        newTotal =
          itemsTotal +
          serviceTotal +
          shippingTotal +
          taxesTotal -
          discountsTotal;
      } else {
        newTotal = itemsTotal + serviceTotal + taxesTotal - discountsTotal;
      }

      setCartTotal(newTotal);
    }
  }, [taxesTotal]);

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
            {userID !== '' && (
              <>
                {address === null && (
                  <AddressForm user_id={userID} selectAddress={selectAddress} />
                )}
                {address !== null && (
                  <Card>
                    <CardContent className="p-0">
                      <section className="flex items-center gap-4 p-4">
                        <p className="w-[75px] text-sm text-muted-foreground">
                          Contact
                        </p>
                        <p className="flex-1 truncate">
                          {address.email?.toUpperCase()}
                        </p>
                        <EditAddress
                          address={address!}
                          setValidationAddresses={setValidationAddresses}
                        />
                      </section>
                      <Separator />
                      <section className="flex items-center gap-4 p-4">
                        <p className="w-[75px] text-sm text-muted-foreground">
                          Ship Address
                        </p>
                        <p className="flex-1 truncate">
                          {address.address_line1} {address.address_line2}{' '}
                          {address.city_locality}, {address.state_province}{' '}
                          {address.postal_code}
                        </p>
                        <EditAddress
                          address={address!}
                          setValidationAddresses={setValidationAddresses}
                        />
                      </section>
                      <Separator />
                      <section className="flex items-center gap-4 p-4">
                        <p className="w-[75px] text-sm text-muted-foreground">
                          Billing Address
                        </p>
                        <p className="flex-1 truncate">
                          {billingAddress?.address_line1}{' '}
                          {billingAddress?.address_line2}{' '}
                          {billingAddress?.city_locality},{' '}
                          {billingAddress?.state_province}{' '}
                          {billingAddress?.postal_code}
                        </p>
                        <EditBillingAddress
                          address={billingAddress!}
                          setValidationAddresses={setValidationBillingAddresses}
                        />
                      </section>
                      {shipments !== null && (
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
                                if (shipment !== 'email') {
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
                                        {shipments[
                                          shipment
                                        ].rate?.service_type.toUpperCase()}
                                      </p>

                                      <p className="text-sm text-muted-foreground">
                                        Estimated Delivery -{' '}
                                        {format(date, 'LLL dd')}
                                      </p>
                                    </aside>
                                    <EditAddress
                                      address={address!}
                                      setValidationAddresses={
                                        setValidationAddresses
                                      }
                                    />
                                  </section>
                                );
                              })}
                            </section>
                          </section>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
                {address !== null && shipments === null && (
                  <ShippingSelect
                    items={props.items}
                    ship_to={address}
                    setShippingTotal={setShippingTotal}
                    setShips={selectShipping}
                  />
                )}
                {address !== null && shipments !== null && (
                  <PaymentForm
                    cart_id={props.cart_id}
                    user_id={userID}
                    shipping_address={address}
                    billing_address={billingAddress!}
                    cart_total={cartTotal}
                    payment_intent={props.payment_intent}
                  />
                )}
              </>
            )}
          </aside>
          <CheckoutSummary
            items={props.items}
            items_total={itemsTotal}
            discount_total={discountsTotal}
            shipping_total={shippingTotal}
            service_total={serviceTotal}
            taxes_total={taxesTotal}
            cart_total={cartTotal}
          />
        </section>
      </section>
      {userID === '' && (
        <LoginForm
          user_id={userID}
          country={props.country}
          city={props.city}
          region={props.region}
          ip={props.ip}
          setUserID={setUserID}
        />
      )}
      {userID !== '' && <RemovedItemsDialogue removedItems={removedItems} />}

      <SelectVerifiedAddress
        matchedAddress={matchedAddress}
        originalAddress={originalAddress}
        selectAddress={selectAddress}
      />
      <SelectVerifiedAddress
        matchedAddress={matchedBillingAddress}
        originalAddress={originalBillingAddress}
        selectAddress={selectBillingAddress}
      />
    </>
  );
}
