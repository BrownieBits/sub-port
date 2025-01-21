
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { _Actions, _Cart, _Items, _Promotions, _RemovedItem, _SetCartProps, _SetItemsProps, _Shipments } from './cartStore.types';

const cartStore = create<_Cart & _Actions>(set => ({
    cart_id: '',
    address: null,
    billing_address: null,
    email: '',
    item_count: 0,
    items: new Map(),
    cart_items: [],
    owner_email: null,
    owner_id: null,
    payment_intent: null,
    shipments: new Map(),
    promotions: new Map(),
    removed_items: [],
    cart_loaded: false,
    shipments_ready: false,
    order_complete: false,
    setCart: (props: _SetCartProps) => set((state) => ({
        ...state,
        cart_id: props.cart_id,
        address: props.address ? props.address : undefined,
        billing_address: props.billing_address ? props.billing_address : undefined,
        email: props.email ? props.email : undefined,
        owner_email: props.owner_email ? props.owner_email : undefined,
        owner_id: props.owner_id ? props.owner_id : undefined,
        payment_intent: props.payment_intent ? props.payment_intent : undefined,
        shipments: props.shipments ? props.shipments : undefined,
        shipments_ready: props.shipments_ready
    })),
    setCartItems: (props: _SetItemsProps) => set((state) => ({
        ...state,
        item_count: props.item_count,
        cart_items: props.cart_items,
    })),
    setItems: (props: _Items) => set((state) => ({
        ...state,
        items: props,
    })),
    clearCart: () => {
        set(() => ({
            cart_id: '',
            address: null,
            billing_address: null,
            email: '',
            item_count: 0,
            items: new Map(),
            cart_items: [],
            owner_email: null,
            owner_id: null,
            payment_intent: null,
            shipments: new Map(),
            promotions: new Map(),
            removed_items: [],
            cart_loaded: false,
            shipments_ready: false,
            order_complete: false,
        }))
    },
    setCartID: (cart_id: string) => {
        set((state) => ({
            ...state,
            cart_id: cart_id,
        }))
    },
    setCartLoaded: (loaded: boolean) => set(() => ({
        cart_loaded: loaded
    })),
    setRemovedItems: (props: _RemovedItem[]) => set(() => ({
        removed_items: props
    })),
    setPromotions: (props: _Promotions) => set(() => ({
        promotions: props
    })),
    updateShipments: (shipments: _Shipments) => set(() => ({
        shipments: shipments
    })),
    setShipmentsReady: (ready: boolean) => set(() => ({
        shipments_ready: ready
    })),
    setOrderComplete: (complete: boolean) => set(() => ({
        order_complete: complete
    }))
}))

export default cartStore;

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('Cart Store', cartStore);
}