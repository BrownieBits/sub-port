import { Timestamp } from 'firebase/firestore';

export type ProductImage = {
    id: number;
    image: string;
};

export type Option = {
    name: string;
    options: string[];
    id?: string;
};

export type GridProduct = {
    name: string;
    images: string[];
    product_type: string;
    price: number;
    compare_at: number;
    currency: string;
    like_count: number;
    store_id: string;
    created_at: Timestamp;
    id: string;
    revenue?: number;
    view_count?: number;
};

export type Item = {
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
export type Promotion = {
    promo_id: string;
    amount: number;
    minimum_order_value: number;
    expiration_date: Timestamp | null;
    name: string;
    status: string;
    type: string;
};

export type RemovedProduct = {
    image_url: string;
    name: string;
    reason: string;
};

export type Address = {
    id?: string;
    address_line1: string;
    address_line2: string;
    address_line3: string | null;
    address_residential_indicator: string;
    city_locality: string;
    company_name: string | null;
    country_code: string;
    email: string | null;
    name: string;
    phone: string | null;
    postal_code: string;
    state_province: string;
    owner_id?: string;
    created_at?: Timestamp;
};
export type Shipment = {
    ship_to: string | Address;
    ship_from: Address | null;
    items: Item[];
    store_name: string;
    store_avatar: string;
    rate: Rate | null;
    error: string | null;
};
export type Shipments = {
    [key: string]: Shipment;
};
export type ShippingCarrier = {
    name: string;
    carrier_id: string;
};
export type Rate = {
    carrier_name: string;
    carrier_id: string;
    delivery_days: number;
    estimated_delivery_date: Date;
    rate: number;
    service_code: string;
    service_type: string;
};



