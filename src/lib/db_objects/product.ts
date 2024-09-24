import { Timestamp } from "firebase/firestore";

type _DBCart = {
    admin_tags: string[];
    compare_at: number;
    currency: string;
    description: string;
    digital_file: string | null;
    digital_file_name: string | null;
    dimensions: {
        height: number;
        width: number;
        length: number;
        units: string
    };
    images: string[];
    inventory: number;
    is_featured: boolean;
    like_count: number;
    name: string;
    owner_id: string;
    price: number;
    product_type: string;
    revenue: number;
    service_percent: number;
    ship_from_address: string | null;
    sku: string;
    status: string;
    store_id: string;
    tags: string[];
    track_inventory: boolean;
    vendor: string;
    vendor_id: string;
    view_count: number;
    weight: {
        units: string;
        value: number
    }
    created_at: Timestamp;
    updated_at: Timestamp
}
type _DBOption = {
    index: number;
    name: string;
    options: string[];
    owner_id: string;
}
type _DBVariant = {
    compare_at: number;
    index: number;
    inventory: number;
    name: string;
    owmer_id: string;
    price: number;
    created_at: Timestamp;
    updated_at: Timestamp;
}