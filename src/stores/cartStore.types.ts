import { Timestamp } from "firebase/firestore";

type _Address = {
    address_line1: string;
    address_line2: string;
    address_line3: string;
    address_residential_indicator: string;
    city_locality: string;
    company_name?: string;
    country_code: string;
    email: string;
    name: string;
    owner_id: string;
    phone: string;
    postal_code: string;
    state_province: string;
}
export type _Item = {
    options: string[];
    quantity: number;
    store_id: string;
    cart_item_id: string;
    id: string;
}
type Rate = {
    carrier_id: string;
    carrier_name: string;
    delivery_days: number;
    estimated_delivery_date: Timestamp;
    rate: number;
    service_code: string;
    service_type: string;
}
export type _CartFullItem = {
    cart_item_id: string;
    id: string;
    options: string[];
    quantity: number;
    store_id: string;
    compare_at: number;
    price: number;
    currency: string;
    images: string[];
    inventory: number;
    track_inventory: boolean;
    product_type: string;
    service_percent: number;
    name: string;
    vendor: string;
    ship_from: string | null;
    weight?: {
        units: string,
        value: number
    },
    dimensions?: {
        height: number,
        length: number,
        units: string,
        width: number
    }
};
export type _StoreItemBreakdown = {
    [key: string]: _CartFullItem[];
};
export type _RemovedItem = {
    image_url: string;
    name: string;
    reason: string;
}
export type _Promotion = {
    promo_id: string;
    amount: number;
    minimum_order_value: number;
    expiration_date: Timestamp | null;
    name: string;
    status: string;
    type: string;
};
export type _Promotions = { [key: string]: _Promotion };
export type _Cart = {
    cart_id: string;
    address?: _Address;
    billing_address?: _Address;
    email?: string;
    item_count: number;
    items: _Item[];
    owner_email?: string;
    owner_id?: string;
    payment_intent?: string;
    store_item_breakdown?: _StoreItemBreakdown;
    removed_items: _RemovedItem[];
    promotions: _Promotions,
    shipments?: {
        [key: string]: {
            error?: string;
            items: _Item[];
            rate: Rate;
            ship_from?: _Address;
            ship_to?: _Address | string;
            store_avatar: string;
            store_name: string
        }
    };
    cart_loaded: boolean;
}
export type _SetCartProps = {
    cart_id: string;
    address?: _Address;
    billing_address?: _Address;
    email?: string;
    owner_email?: string;
    owner_id?: string;
    payment_intent?: string;
    shipments?: {
        [key: string]: {
            error?: string;
            items: _Item[];
            rate: Rate;
            ship_from?: _Address;
            ship_to?: _Address | string;
            store_avatar: string;
            store_name: string
        }
    };
}
export type _SetItemsProps = {
    items: _Item[];
    item_count: number;
}
export type _Actions = {
    setCart: (props: _SetCartProps) => void;
    setItems: (props: _SetItemsProps) => void;
    setStoreItemBreakdown: (props: _StoreItemBreakdown) => void;
    setCartID: (props: string) => void;
    setCartLoaded: (props: boolean) => void;
    clearCart: () => void;
    setRemovedItems: (props: _RemovedItem[]) => void;
    setPromotions: (props: _Promotions) => void;
}

