'use client';

import ProductCard from '@/components/sp-ui/ProductCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { analytics, db } from '@/lib/firebase';
import { GridProduct, Item, Promotion, RemovedProduct } from '@/lib/types';
import { logEvent } from 'firebase/analytics';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import StoreItems from './storeItems';

type Items = {
  [key: string]: Item[];
};
type Promotions = {
  [key: string]: Promotion;
};

type Props = {
  cart_id: string;
  country: string;
  city: string;
  region: string;
  ip: string;
};

export default function CartDetailPage(props: Props) {
  const [items, setItems] = React.useState<Items | null>(null);
  const [itemsTotal, setItemsTotal] = React.useState<number>(0);
  const [serviceTotal, setServiceTotal] = React.useState<number>(0);
  const [cartTotal, setCartTotal] = React.useState<number>(0);
  const [promotions, setPromotions] = React.useState<Promotions | null>(null);
  const [discountsTotal, setDiscountsTotal] = React.useState<number>(0);
  const [related, setRelated] = React.useState<GridProduct[]>([]);
  const [removedItems, setRemovedItems] = React.useState<RemovedProduct[]>([]);
  const [removedDialogueOpen, setRemovedDialogueOpen] =
    React.useState<boolean>(false);

  async function updateQuantity(store_id: string, index: number, item: Item) {
    const newItems = { ...items! };
    newItems[store_id] = newItems[store_id].slice(0);
    newItems[store_id][index] = item;
    setItems(newItems);
  }
  async function removeItem(store_id: string, index: number) {
    const newItems = { ...items! };
    const newStoreItems = newItems[store_id].slice(0);
    if (newStoreItems.length === 1 && index === 0) {
      delete newItems[store_id];
    } else {
      newStoreItems.splice(index, 1);
      newItems[store_id] = newStoreItems;
    }
    setItems(newItems);
  }
  async function updatePromotions(store_id: string, promotion?: Promotion) {
    const newPromos = { ...promotions! };
    if (promotion === undefined) {
      delete newPromos[store_id];
    } else {
      newPromos[store_id] = promotion;
    }
    setPromotions(newPromos);
  }

  React.useEffect(() => {
    if (analytics !== null) {
      logEvent(analytics, 'page_view', {
        title: 'Cart',
      });
    }
    const getItems = async () => {
      const itemsRef: CollectionReference = collection(
        db,
        'carts',
        props.cart_id,
        'items'
      );
      const itemsQuery = query(itemsRef);
      const itemsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(itemsQuery);

      const productIDs: string[] = [];
      const cartItems: Items = {};
      const removed_items: RemovedProduct[] = [];
      const batch = writeBatch(db);
      if (!itemsData.empty) {
        itemsData.docs.map((doc) => {
          productIDs.push(doc.id.split('_')[0]);
          if (!cartItems.hasOwnProperty(doc.data().store_id)) {
            cartItems[doc.data().store_id] = [
              {
                cart_item_id: doc.id,
                id: doc.id.split('_')[0],
                options: doc.data().options || [],
                quantity: doc.data().quantity,
                store_id: doc.data().store_id,
                compare_at: 0.0,
                price: 0.0,
                currency: 'USD',
                images: [],
                inventory: 0,
                track_inventory: false,
                product_type: '',
                name: '',
                vendor: '',
                service_percent: 0,
                ship_from: null,
              },
            ];
          } else {
            cartItems[doc.data().store_id].push({
              cart_item_id: doc.id,
              id: doc.id.split('_')[0],
              options: doc.data().options || [],
              quantity: doc.data().quantity,
              store_id: doc.data().store_id,
              compare_at: 0.0,
              price: 0.0,
              currency: 'USD',
              images: [],
              inventory: 0,
              track_inventory: false,
              product_type: '',
              name: '',
              vendor: '',
              service_percent: 0,
              ship_from: null,
            });
          }
        });
        const productsRef: CollectionReference = collection(db, 'products');
        const productsQuery = query(
          productsRef,
          where('__name__', 'in', productIDs)
        );
        const productsData: QuerySnapshot<DocumentData, DocumentData> =
          await getDocs(productsQuery);

        await Promise.all(
          productsData.docs.map(async (document) => {
            if (document.data().status === 'Private') {
              let removeIndex = 0;
              cartItems[document.data().store_id].map((item, index) => {
                if (item.id === document.id) {
                  removeIndex = index;
                  removed_items.push({
                    image_url: document.data().images[0],
                    name: document.data().name,
                    reason: 'Product no longer public.',
                  });
                  const removeDoc: DocumentReference = doc(
                    db,
                    `carts/${props.cart_id}/items`,
                    item.cart_item_id
                  );
                  batch.delete(removeDoc);
                }
              });
              cartItems[document.data().store_id].splice(removeIndex, 1);
              if (cartItems[document.data().store_id].length === 0) {
                delete cartItems[document.data().store_id];
              }
            } else if (
              document.data().track_inventory &&
              document.data().inventory === 0
            ) {
              let removeIndex = 0;
              cartItems[document.data().store_id].map((item, index) => {
                if (item.id === document.id) {
                  removeIndex = index;
                  removed_items.push({
                    image_url: document.data().images[0],
                    name: document.data().name,
                    reason: 'Product out of stock.',
                  });
                  const removeDoc: DocumentReference = doc(
                    db,
                    `carts/${props.cart_id}/items`,
                    item.cart_item_id
                  );
                  batch.delete(removeDoc);
                }
              });
              cartItems[document.data().store_id].splice(removeIndex, 1);
              if (cartItems[document.data().store_id].length === 0) {
                delete cartItems[document.data().store_id];
              }
            } else {
              await Promise.all(
                cartItems[document.data().store_id].map(async (item) => {
                  if (item.id === document.id) {
                    item.compare_at = document.data().compare_at as number;
                    item.price = document.data().price as number;
                    item.currency = document.data().currency;
                    item.images = document.data().images;
                    item.inventory = document.data().inventory;
                    item.track_inventory = document.data().track_inventory;
                    item.product_type = document.data().product_type;
                    item.name = document.data().name;
                    (item.vendor = document.data().vendor),
                      (item.service_percent = document.data().service_percent);
                    if (item.options.length > 0) {
                      const variantRef: DocumentReference = doc(
                        db,
                        'products',
                        document.id,
                        'variants',
                        item.options.join('-')
                      );
                      const variantDoc: DocumentData = await getDoc(variantRef);
                      if (variantDoc.exists()) {
                        item.compare_at = variantDoc.data()
                          .compare_at as number;
                        item.price = variantDoc.data().price as number;
                        item.inventory = variantDoc.data().inventory;
                      }
                    }
                    if (
                      item.track_inventory &&
                      item.inventory < item.quantity
                    ) {
                      item.quantity = item.inventory;
                      removed_items.push({
                        image_url: document.data().images[0],
                        name: document.data().name,
                        reason: `Only ${item.inventory} in stock.`,
                      });
                    }
                  }
                })
              );
            }
          })
        );
      }
      await batch.commit();
      const promosRef: CollectionReference = collection(
        db,
        'carts',
        props.cart_id,
        'promotions'
      );
      const promosQuery = query(promosRef);
      const promosData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(promosQuery);
      const promotions: Promotions = {};
      if (!promosData.empty) {
        await Promise.all(
          promosData.docs.map(async (promo) => {
            const promotionRef: DocumentReference = doc(
              db,
              'stores',
              promo.id,
              'promotions',
              promo.data().id
            );
            const promotionDoc: DocumentData = await getDoc(promotionRef);
            if (
              promotionDoc.exists() &&
              promotionDoc.data().status === 'Active'
            ) {
              promotions[promo.id] = {
                promo_id: promotionDoc.id,
                amount: promotionDoc.data().amount,
                minimum_order_value: promotionDoc.data().minimum_order_value,
                expiration_date: promotionDoc.data().expiration_date,
                name: promotionDoc.data().name,
                status: promotionDoc.data().status,
                type: promotionDoc.data().type,
              };
            }
          })
        );
      }
      setRemovedItems(removed_items);
      setPromotions(promotions);
      setItems(cartItems);

      const store_ids = Object.keys(cartItems);

      if (store_ids.length > 0) {
        const relatedRef: CollectionReference = collection(db, 'products');
        const relatedQuery = query(
          relatedRef,
          where('store_id', 'in', store_ids),
          where('revenue', '>=', 0),
          where('status', '==', 'Public'),
          orderBy('revenue'),
          limit(8)
        );
        const relatedData: QuerySnapshot<DocumentData, DocumentData> =
          await getDocs(relatedQuery);

        const products: GridProduct[] = relatedData.docs.map((product) => {
          return {
            name: product.data().name,
            images: product.data().images,
            product_type: product.data().product_type,
            price: product.data().price,
            compare_at: product.data().compare_at,
            currency: product.data().currency,
            like_count: product.data().like_count,
            store_id: product.data().store_id,
            created_at: product.data().created_at,
            id: product.id,
          };
        });
        setRelated(products);
      } else {
        setRelated([]);
      }
    };
    getItems();
  }, []);
  React.useEffect(() => {
    if (items !== null) {
      let item_total = 0;
      let service_total = 0;
      let discounts_total = 0;

      Object.keys(items).map((store) => {
        let store_total = 0;
        items[store].map((item) => {
          if (item.compare_at > 0 && item.compare_at < item.price) {
            store_total +=
              parseFloat(item.compare_at.toString()) * item.quantity;
            item_total +=
              parseFloat(item.compare_at.toString()) * item.quantity;
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
        if (promotions?.hasOwnProperty(store)) {
          const expiration = promotions[store].expiration_date as Timestamp;
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
            promotions[store].minimum_order_value > 0 &&
            promotions[store].minimum_order_value > store_total
          ) {
            minimum_good = false;
          }
          if (minimum_good && expiration_good) {
            if (promotions[store].type === 'Flat Amount') {
              discounts_total += promotions[store].amount;
            } else if (promotions[store].type === 'Percentage') {
              const discount_amount =
                store_total * (promotions[store].amount / 100);
              discounts_total += discount_amount;
            }
          }
        }
      });

      setDiscountsTotal(discounts_total);
      setItemsTotal(item_total);
      setServiceTotal(service_total);
      setCartTotal(item_total + service_total - discounts_total);
    }
  }, [items, promotions]);
  React.useEffect(() => {
    if (removedItems.length > 0) {
      setRemovedDialogueOpen(true);
    }
  }, [removedItems]);

  if (items === null) {
    return (
      <>
        <section className="mx-auto w-full max-w-[1754px]">
          <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
            <h1>Cart</h1>
          </section>
        </section>
        <Separator />
        <section className="mx-auto flex w-full max-w-[1754px] flex-col gap-8 px-4 py-8">
          <section className="flex w-full flex-col gap-8 md:flex-row">
            <section className="flex w-full flex-1 flex-col gap-4">
              <Skeleton className="h-[200px] w-full rounded bg-layer-two" />
              <Skeleton className="h-[200px] w-full rounded bg-layer-two" />
            </section>
            <section className="flex w-full flex-col gap-4 md:w-[350px] xl:w-[400px]">
              <Skeleton className="h-7 w-[100px] rounded bg-layer-two" />
              <section className="flex w-full flex-col gap-2">
                <section className="flex w-full justify-between">
                  <Skeleton className="h-5 w-[150px] rounded bg-layer-two" />
                  <Skeleton className="h-5 w-[50px] rounded bg-layer-two" />
                </section>
                <section className="flex w-full justify-between">
                  <Skeleton className="h-5 w-[150px] rounded bg-layer-two" />
                  <Skeleton className="h-5 w-[50px] rounded bg-layer-two" />
                </section>
                <section className="flex w-full justify-between">
                  <Skeleton className="h-5 w-[150px] rounded bg-layer-two" />
                  <Skeleton className="h-5 w-[50px] rounded bg-layer-two" />
                </section>
                <section className="flex w-full justify-between pb-4">
                  <Skeleton className="h-4 w-full rounded bg-layer-two" />
                </section>
                <Separator />
                <section className="flex w-full justify-between pt-4">
                  <Skeleton className="h-5 w-[150px] rounded bg-layer-two" />
                  <Skeleton className="h-5 w-[50px] rounded bg-layer-two" />
                </section>
              </section>
              <Skeleton className="h-[40px] w-full rounded bg-layer-two" />
            </section>
          </section>
          <section></section>
          <section></section>
        </section>
      </>
    );
  }
  if (Object.keys(items).length === 0) {
    return (
      <>
        <section className="mx-auto w-full max-w-[1754px]">
          <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
            <h1>Cart</h1>
          </section>
        </section>
        <Separator />
        <section className="mx-auto flex w-full max-w-[1754px] flex-col gap-8 px-4 py-8">
          <section className="flex w-full flex-col items-center justify-start p-8">
            <svg
              width="150"
              height="150"
              viewBox="0 0 150 150"
              className="mb-8 fill-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M118.75 6.25L110.875 23.4375L93.75 31.25L110.875 39.125L118.75 56.25L126.562 39.125L143.75 31.25L126.562 23.4375M56.25 25L40.625 59.375L6.25 75L40.625 90.625L56.25 125L71.875 90.625L106.25 75L71.875 59.375M118.75 93.75L110.875 110.875L93.75 118.75L110.875 126.562L118.75 143.75L126.562 126.562L143.75 118.75L126.562 110.875" />
            </svg>
            <h3 className="mb-4">Your cart is empty!</h3>
            <p className="mb-8">
              Keep shopping around and add items to your cart...
            </p>
            <Button asChild>
              <Link href="/" title="Continue Shopping">
                Continue Shopping
              </Link>
            </Button>
          </section>
        </section>
      </>
    );
  }
  return (
    <>
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Cart</h1>
          <Button asChild>
            <Link href="/checkout">Checkout</Link>
          </Button>
        </section>
      </section>
      <Separator />
      <section className="mx-auto flex w-full max-w-[1754px] flex-col gap-8 px-4 py-8">
        <section className="flex w-full flex-col gap-8 md:flex-row">
          <section className="flex w-full flex-1 flex-col gap-4">
            {Object.keys(items).map((store) => {
              let promo = null;
              if (promotions?.hasOwnProperty(store)) {
                promo = promotions[store];
              }
              return (
                <StoreItems
                  cart_id={props.cart_id}
                  store_id={store}
                  items={items[store]}
                  promotion={promo}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  updatePromotions={updatePromotions}
                  key={`store-${store}`}
                />
              );
            })}
          </section>
          <section className="flex w-full flex-col gap-4 md:w-[350px] xl:w-[400px]">
            <h3>Summary</h3>
            <section className="flex w-full flex-col gap-2">
              <section className="flex w-full justify-between">
                <p>Item(s) Total:</p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(itemsTotal)}
                </p>
              </section>
              <section className="flex w-full justify-between">
                <p>Service Fees:</p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(serviceTotal)}
                </p>
              </section>
              <section className="flex w-full justify-between">
                <p>Discounts:</p>
                <p>
                  {discountsTotal > 0 && <>-</>}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(discountsTotal)}
                </p>
              </section>
              <section className="flex w-full justify-between pb-4">
                <p className="text-sm text-muted-foreground">
                  Shipping, and taxes are calculated at checkout
                </p>
              </section>
              <Separator />
              <section className="flex w-full justify-between pt-4">
                <p>
                  <b>Total:</b>
                </p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(cartTotal)}
                </p>
              </section>
            </section>
            <Button className="w-full" asChild>
              <Link href="/checkout" className="w-full">
                Checkout
              </Link>
            </Button>
          </section>
        </section>
        {related.length > 0 && (
          <section className="flex w-full flex-col gap-4">
            <h3>You might like</h3>
            <section className="grid grid-cols-1 gap-8 md:grid-cols-3 xl:grid-cols-6">
              {related?.map((doc) => (
                <ProductCard product={doc} show_creator={true} key={doc.id} />
              ))}
            </section>
          </section>
        )}

        <section></section>
      </section>
      <Dialog open={removedDialogueOpen} onOpenChange={setRemovedDialogueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>We adjusted your cart...</DialogTitle>
            <DialogDescription>
              <section className="flex w-full flex-col gap-4 pt-4">
                {removedItems.map((item) => {
                  return (
                    <section
                      className="flex w-full items-center gap-4"
                      key={`removed-item-${item.name}`}
                    >
                      <Image
                        src={item.image_url}
                        alt={`Removed Item-${item.name}`}
                        width={50}
                        height={50}
                        className="w-[50px]"
                      />
                      <section className="w-full flex-1">
                        <p className="text-foreground">{item.name}</p>
                        <p className="text-xs text-destructive">
                          {item.reason}
                        </p>
                      </section>
                    </section>
                  );
                })}
              </section>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
