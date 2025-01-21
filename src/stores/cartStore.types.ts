
export type _Address = {
    id?: string;
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
export type _Rate = {
    carrier_id: string;
    carrier_name: string;
    delivery_days: number;
    estimated_delivery_date: Date | null;
    rate: number;
    service_code: string;
    service_type: string;
    package_type: string | null;
}
export type _Item = {
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
    vendor_id: string;
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
}
export type _CartItem = {
    options: string[];
    quantity: number;
    store_id: string;
    cart_item_id: string;
    id: string;
}
export type _RemovedItem = {
    image_url: string;
    name: string;
    reason: string;
}
export type _Promotion = {
    promo_id: string;
    amount: number;
    minimum_order_value: number;
    expiration_date: Date | null;
    name: string;
    status: string;
    type: string;
};
export type _Shipment = {
    error: string | null;
    items: _Item[];
    rate: _Rate | null;
    name: string | null;
    ship_from: _Address | string | null;
    ship_to: _Address | string | null;
    store_id: string;
    tracking_number: string | null;
    status: string;
}
export type _Items = Map<string, _Item[]>;
export type _Shipments = Map<string, _Shipment>;
export type _Promotions = Map<string, _Promotion>;
export type _Cart = {
    cart_id: string;
    address: _Address | null;
    billing_address: _Address | null;
    email: string;
    item_count: number;
    items: _Items;
    cart_items: _CartItem[];
    owner_email: string | null;
    owner_id: string | null;
    payment_intent: string | null;
    removed_items: _RemovedItem[];
    promotions: _Promotions;
    shipments: _Shipments;
    cart_loaded: boolean;
    shipments_ready: boolean;
    order_complete: boolean;
}



export type _SetCartProps = {
    cart_id: string;
    address: _Address | null;
    billing_address: _Address | null;
    email: string;
    owner_email: string | null;
    owner_id: string | null;
    payment_intent: string | null;
    shipments: _Shipments | null;
    shipments_ready: boolean;
}
export type _SetItemsProps = {
    cart_items: _CartItem[];
    item_count: number;
}

export type _Actions = {
    setCart: (props: _SetCartProps) => void;
    setCartItems: (props: _SetItemsProps) => void;
    setItems: (props: _Items) => void;
    setCartID: (props: string) => void;
    setCartLoaded: (props: boolean) => void;
    clearCart: () => void;
    setRemovedItems: (props: _RemovedItem[]) => void;
    setPromotions: (props: _Promotions) => void;
    updateShipments: (shipments: _Shipments) => void;
    setShipmentsReady: (ready: boolean) => void;
    setOrderComplete: (complete: boolean) => void;
}

