import { Timestamp } from "firebase/firestore";

export type _Address = {
    doc_id?: string;
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
export type _Rate = {
    carrier_id: string;
    carrier_name: string;
    delivery_days: number;
    estimated_delivery_date: Timestamp;
    rate: number;
    service_code: string;
    service_type: string;
    package_type: string | null;
}
export type _CartFullItem = {
    cart_item_id: string;
    id: string;
    options: string[];
    order_options?: string[];
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
export type _Shipment = {
    error?: string;
    items: _Item[];
    full_items?: _CartFullItem[];
    rate?: _Rate;
    name?: string;
    ship_from?: _Address;
    ship_to?: _Address | string;
    store_id: string;
}
export type _Shipments = {
    [key: string]: _Shipment;
}
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
    shipments?: _Shipments;
    cart_loaded: boolean;
    shipments_ready: boolean;
    order_complete: boolean;
}
export type _SetCartProps = {
    cart_id: string;
    address?: _Address;
    billing_address?: _Address;
    email?: string;
    owner_email?: string;
    owner_id?: string;
    payment_intent?: string;
    shipments?: _Shipments;
    shipments_ready: boolean;
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
    updateShipments: (shipments: _Shipments) => void;
    setShipmentsReady: (ready: boolean) => void;
    setOrderComplete: (complete: boolean) => void;
}

