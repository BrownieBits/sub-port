
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { _Actions, _Cart, _Promotions, _RemovedItem, _SetCartProps, _SetItemsProps, _StoreItemBreakdown } from './cartStore.types';

const cartStore = create<_Cart & _Actions>(set => ({
    cart_id: '',
    address: undefined,
    billing_address: undefined,
    email: '',
    item_count: 0,
    items: [],
    owner_email: undefined,
    owner_id: undefined,
    payment_intent: undefined,
    shipments: undefined,
    store_item_breakdown: undefined,
    cart_loaded: false,
    removed_items: [],
    promotions: {},
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
    })),
    setItems: (props: _SetItemsProps) => set((state) => ({
        ...state,
        item_count: props.item_count,
        items: props.items,
    })),
    setStoreItemBreakdown: (props: _StoreItemBreakdown) => set((state) => ({
        ...state,
        store_item_breakdown: props
    })),
    clearCart: () => {
        console.log("CLEARING CART")
        set(() => ({
            cart_id: '',
            address: undefined,
            billing_address: undefined,
            email: undefined,
            item_count: 0,
            items: [],
            owner_email: undefined,
            owner_id: undefined,
            payment_intent: undefined,
            shipments: undefined,
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
    }))
}))

export default cartStore;

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('Cart Store', cartStore);
}