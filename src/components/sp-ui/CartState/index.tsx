'use client';

import { auth, db } from '@/lib/firebase';
import {
  _CartItem,
  _Item,
  _Items,
  _Promotions,
  _RemovedItem,
  _SetCartProps,
} from '@/lib/types';
import cartStore from '@/stores/cartStore';
import { deleteCookie, getCookie, setCookie } from 'cookies-next/client';
import { User } from 'firebase/auth';
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  QuerySnapshot,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import React from 'react';

export default function CartState() {
  const cart_cookie = getCookie('cart_id');
  const cart_id = cartStore((state) => state.cart_id);
  const cart_items = cartStore((state) => state.cart_items);
  const order_complete = cartStore((state) => state.order_complete);
  const setCart = cartStore((state) => state.setCart);
  const setItems = cartStore((state) => state.setItems);
  const setCartItems = cartStore((state) => state.setCartItems);
  // const setStoreItemBreakdown = cartStore(
  //   (state) => state.setStoreItemBreakdown
  // );
  const setRemovedItems = cartStore((state) => state.setRemovedItems);
  const setCartID = cartStore((state) => state.setCartID);
  const setCartLoaded = cartStore((state) => state.setCartLoaded);
  const clearCart = cartStore((state) => state.clearCart);
  const setPromotions = cartStore((state) => state.setPromotions);
  const setOrderComplete = cartStore((state) => state.setOrderComplete);

  function setCartCookie(newCartID: string) {
    const today = new Date();
    const expires = new Date(today.setMonth(today.getMonth() + 1));
    setCookie('cart_id', newCartID, {
      secure: true,
      expires: expires,
    });
  }

  async function createNewCart(email?: string, user_id?: string) {
    const cartsReference: CollectionReference = collection(db, 'carts');
    const cartsDoc: DocumentReference = doc(cartsReference);
    if (email !== undefined && user_id !== undefined) {
      await setDoc(cartsDoc, {
        owner_id: user_id,
        owner_email: email,
        address: null,
        billing_address: null,
        email: '',
        payment_intent: null,
        shipments: null,
        shipments_ready: false,
        created_at: Timestamp.fromDate(new Date()),
      });
    }

    setCartCookie(cartsDoc.id);
    setCartID(cartsDoc.id);
  }

  async function updateCartToUserCart(email: string, user_id: string) {
    const cartRef: DocumentReference = doc(db, 'carts', cart_cookie!);
    const cartsDoc = await getDoc(cartRef);
    if (cartsDoc.exists()) {
      await updateDoc(cartRef, {
        owner_id: user_id,
        owner_email: email,
        updated_at: Timestamp.fromDate(new Date()),
      });
    } else {
      await setDoc(cartRef, {
        owner_id: user_id,
        owner_email: email,
        address: null,
        billing_address: null,
        email: '',
        payment_intent: null,
        shipments: null,
        shipments_ready: false,
        created_at: Timestamp.fromDate(new Date()),
      });
    }
    setCartCookie(cart_cookie!);
    setCartID(cart_cookie!);
  }

  async function checkUserCarts(user: User) {
    const userCartsReference: CollectionReference = collection(db, 'carts');
    const q = query(
      userCartsReference,
      where('owner_id', '==', user?.uid),
      limit(1)
    );
    const userCartsData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(q);
    if (userCartsData.empty) {
      if (cart_cookie === undefined) {
        createNewCart(user?.email!, user.uid);
      } else {
        updateCartToUserCart(user?.email!, user.uid);
      }
    } else {
      if (cart_cookie === undefined) {
        setCartCookie(userCartsData.docs[0].id);
        setCartID(userCartsData.docs[0].id);
      } else if (cart_cookie === userCartsData.docs[0].id) {
        setCartID(cart_cookie!);
        setCartCookie(cart_cookie!);
      } else {
        const cartRef: DocumentReference = doc(db, 'carts', cart_cookie!);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          if (cartDoc.data().items > 0) {
            const deleteRef: DocumentReference = doc(
              db,
              'carts',
              userCartsData.docs[0].id
            );
            await deleteDoc(deleteRef);
            setCartCookie(cartDoc.id);
            setCartID(cartDoc.id);
          } else {
            await deleteDoc(cartRef);
            setCartCookie(userCartsData.docs[0].id);
            setCartID(userCartsData.docs[0].id);
          }
        } else {
          setCartCookie(userCartsData.docs[0].id);
          setCartID(userCartsData.docs[0].id);
        }
      }
    }
  }

  async function checkIfUserCart() {
    const cartsRef: DocumentReference = doc(db, 'carts', cart_cookie!);
    const cartDoc = await getDoc(cartsRef);

    if (cartDoc.exists()) {
      if (cartDoc.data().owner_id === null) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async function createCart(cartRef: DocumentReference) {
    await setDoc(cartRef, {
      owner_id: null,
      owner_email: null,
      address: null,
      billing_address: null,
      email: '',
      payment_intent: null,
      shipments: null,
      shipments_ready: false,
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
    });
  }

  React.useEffect(() => {
    auth.onAuthStateChanged(async function handleAuth(user) {
      if (user) {
        checkUserCarts(user);
      } else {
        if (cart_cookie === undefined) {
          createNewCart();
        } else {
          const is_user_cart: boolean = await checkIfUserCart();
          if (is_user_cart) {
            createNewCart();
          } else {
            setCartID(cart_cookie);
          }
        }
      }
    });
  }, []);
  React.useEffect(() => {
    const getLatest = () => {
      const cartRef: DocumentReference = doc(db, `carts/`, cart_id);
      const itemsRef: CollectionReference = collection(
        db,
        `carts/`,
        cart_id,
        'items'
      );
      const promosRef: CollectionReference = collection(
        db,
        'carts',
        cart_id,
        'promotions'
      );
      const cartUnsubscribe = onSnapshot(cartRef, (snapshot) => {
        if (snapshot.exists()) {
          let newShipment = snapshot.data()?.shipments;
          if (newShipment !== null) {
            newShipment = new Map(Object.entries(newShipment));
          }
          const cart: _SetCartProps = {
            cart_id: snapshot.id,
            address: snapshot.data()?.address,
            billing_address: snapshot.data()?.billing_address,
            email: snapshot.data()?.email,
            owner_email: snapshot.data()?.owner_email,
            owner_id: snapshot.data()?.owner_id,
            payment_intent: snapshot.data()?.payment_intent,
            shipments: newShipment,
            shipments_ready: snapshot.data()?.shipments_ready,
          };
          setCart(cart);
        } else {
          if (!order_complete) {
            // createCart(cartRef);
          }
        }
      });
      const itemsUnsubscribe = onSnapshot(itemsRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: _CartItem[] = [];
          let item_count: number = 0;
          snapshot.docs.map((doc) => {
            items.push({
              cart_item_id: doc.id,
              id: doc.id.split('_')[0],
              options: doc.data().options,
              quantity: doc.data().quantity,
              store_id: doc.data().store_id,
            });
            item_count += parseInt(doc.data().quantity as string);
          });
          setCartItems({ cart_items: items, item_count: item_count });
        } else {
          setCartItems({ cart_items: [], item_count: 0 });
        }
      });
      const promosUnsubscribe = onSnapshot(promosRef, async (snapshot) => {
        if (!snapshot.empty) {
          const newPromotions: _Promotions = new Map();
          await Promise.all(
            snapshot.docs.map(async (promo) => {
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
                newPromotions.set(promo.id, {
                  promo_id: promotionDoc.id,
                  amount: promotionDoc.data().amount,
                  minimum_order_value: promotionDoc.data().minimum_order_value,
                  expiration_date: promotionDoc.data().expiration_date
                    ? new Date(
                        promotionDoc.data().expiration_date.seconds * 1000
                      )
                    : null,
                  name: promotionDoc.data().name,
                  status: promotionDoc.data().status,
                  type: promotionDoc.data().type,
                });
              }
            })
          );
          setPromotions(newPromotions);
        } else {
          setPromotions(new Map());
        }
      });
      return {
        cartUnsub: cartUnsubscribe,
        itemsUnsub: itemsUnsubscribe,
        promosUnsub: promosUnsubscribe,
      };
    };
    if (cart_id !== '') {
      const { cartUnsub, itemsUnsub, promosUnsub } = getLatest();
      return () => {
        cartUnsub();
        itemsUnsub();
        promosUnsub();
      };
    }
  }, [cart_id]);

  React.useEffect(() => {
    const getLatest = () => {
      const productIDs: string[] = [];
      const items: _Items = new Map();
      const removedItems: _RemovedItem[] = [];
      cart_items.map((item) => {
        productIDs.push(item.id);
        if (!items.has(item.store_id)) {
          items.set(item.store_id, [
            {
              cart_item_id: item.cart_item_id,
              id: item.id,
              options: item.options,
              quantity: item.quantity,
              store_id: item.store_id,
              compare_at: 0,
              price: 0,
              currency: 'USD',
              images: [],
              inventory: 0,
              track_inventory: false,
              product_type: '',
              name: '',
              vendor: '',
              vendor_id: '',
              service_percent: 0,
              ship_from: null,
              weight: {
                units: 'lbs',
                value: 0,
              },
              dimensions: {
                height: 0,
                length: 0,
                units: 'in',
                width: 0,
              },
            },
          ]);
        } else {
          items.get(item.store_id)?.push({
            cart_item_id: item.cart_item_id,
            id: item.id,
            digital_download: '',
            options: item.options,
            quantity: item.quantity,
            store_id: item.store_id,
            compare_at: 0.0,
            price: 0.0,
            currency: 'USD',
            images: [],
            inventory: 0,
            track_inventory: false,
            product_type: '',
            name: '',
            vendor: '',
            vendor_id: '',
            service_percent: 0,
            ship_from: null,
            weight: {
              units: 'lbs',
              value: 0,
            },
            dimensions: {
              height: 0,
              length: 0,
              units: 'in',
              width: 0,
            },
          });
        }
      });

      const productsRef: CollectionReference = collection(db, 'products');
      const productsQuery = query(
        productsRef,
        where('__name__', 'in', productIDs)
      );

      const unsubscribe = onSnapshot(productsQuery, async (snapshot) => {
        if (!snapshot.empty) {
          const batch = writeBatch(db);
          await Promise.all(
            snapshot.docs.map(async (document) => {
              if (document.data().status === 'Private') {
                let removeIndex = 0;
                items.get(document.data().store_id)?.map((item, index) => {
                  if (item.id === document.id) {
                    removeIndex = index;
                    removedItems.push({
                      image_url: document.data().images[0],
                      name: document.data().name,
                      reason: 'Product no longer public.',
                    });
                    const removeDoc: DocumentReference = doc(
                      db,
                      `carts/${cart_id}/items`,
                      item.cart_item_id
                    );
                    batch.delete(removeDoc);
                  }
                });
                items.get(document.data().store_id)?.splice(removeIndex, 1);
                if (items.get(document.data().store_id)?.length === 0) {
                  items.delete(document.data().store_id);
                }
              } else if (
                document.data().track_inventory &&
                document.data().inventory === 0
              ) {
                let removeIndex = 0;
                items.get(document.data().store_id)?.map((item, index) => {
                  if (item.id === document.id) {
                    removeIndex = index;
                    removedItems.push({
                      image_url: document.data().images[0],
                      name: document.data().name,
                      reason: 'Product out of stock.',
                    });
                    const removeDoc: DocumentReference = doc(
                      db,
                      `carts/${cart_id}/items`,
                      item.cart_item_id
                    );
                    batch.delete(removeDoc);
                  }
                });
                items.get(document.data().store_id)?.splice(removeIndex, 1);
                if (items.get(document.data().store_id)?.length === 0) {
                  items.delete(document.data().store_id);
                }
              } else {
                const storeItems = items.get(document.data().store_id);
                if (storeItems !== undefined) {
                  await Promise.all(
                    storeItems.map(async (item: _Item) => {
                      if (item.id === document.id) {
                        item.compare_at = document.data().compare_at as number;
                        item.price = document.data().price as number;
                        item.currency = document.data().currency;
                        item.images = document.data().images;
                        item.inventory = document.data().inventory;
                        item.track_inventory = document.data().track_inventory;
                        item.product_type = document.data().product_type;
                        item.name = document.data().name;
                        item.digital_download =
                          document.data().product_type === 'Digital'
                            ? document.data().digital_file
                            : '';
                        if (
                          document.data().ship_from_address !== undefined &&
                          document.data().ship_from_address !== null
                        ) {
                          item.ship_from = document.data().ship_from_address;
                        }

                        (item.vendor = document.data().vendor),
                          (item.service_percent =
                            document.data().service_percent);
                        if (item.options.length > 0) {
                          const variantRef: DocumentReference = doc(
                            db,
                            'products',
                            document.id,
                            'variants',
                            item.options.join('-')
                          );
                          const variantDoc: DocumentData =
                            await getDoc(variantRef);
                          if (variantDoc.exists()) {
                            item.compare_at = variantDoc.data()
                              .compare_at as number;
                            item.price = variantDoc.data().price as number;
                            item.inventory = variantDoc.data().inventory;
                            if (document.data().vendor === 'printful') {
                              item.vendor_id = variantDoc.data().vendor_id;
                            }
                          }
                        }
                        if (
                          item.track_inventory &&
                          item.inventory < item.quantity
                        ) {
                          item.quantity = item.inventory;
                          removedItems.push({
                            image_url: document.data().images[0],
                            name: document.data().name,
                            reason: `Only ${item.inventory} in stock.`,
                          });
                        }
                        if (
                          document.data().dimensions !== undefined &&
                          document.data().dimensions !== null
                        ) {
                          item.dimensions = document.data().dimensions;
                        }
                        if (
                          document.data().weight !== undefined &&
                          document.data().weight !== null
                        ) {
                          item.weight = document.data().weight;
                        }
                      }
                    })
                    // items.get(document.data().store_id)?.map((item) => {
                    // });
                    // cartItems[document.data().store_id].map(async (item) => {
                    //   if (item.id === document.id) {

                    //   }
                    // })
                  );
                }
              }
            })
          );
          setItems(items);
          if (removedItems.length > 0) {
            setRemovedItems(removedItems);
          }
          setCartLoaded(true);
          await batch.commit();
        } else {
          setItems(new Map());
          setRemovedItems([]);
          setCartLoaded(true);
        }
      });

      return unsubscribe;
    };
    if (cart_items.length > 0) {
      const unsub = getLatest();
      return unsub;
    } else if (cart_items.length === 0) {
      setItems(new Map());
      setRemovedItems([]);
      setCartLoaded(true);
    }
  }, [cart_items]);

  React.useEffect(() => {
    const getLatest = async () => {
      const user = await auth.currentUser;
      deleteCookie('cart_id');
      const cartID = cart_id;
      const batch = writeBatch(db);
      const deleteRef: DocumentReference = doc(db, 'carts', cartID);
      batch.delete(deleteRef);
      const delItemsRef: CollectionReference = collection(
        db,
        `carts/${cartID}/items`
      );
      const delPromosRef: CollectionReference = collection(
        db,
        `carts/${cartID}/promotions`
      );
      const delItemsDocs: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(delItemsRef);
      const delPromosDocs: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(delPromosRef);
      delItemsDocs.docs.map((doc) => {
        batch.delete(doc.ref);
      });
      delPromosDocs.docs.map((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      clearCart();
      if (user) {
        createNewCart(user.email!, user.uid);
      } else {
        createNewCart();
      }
      setOrderComplete(false);
    };
    if (order_complete) {
      getLatest();
    }
  }, [order_complete]);

  return <></>;
}
