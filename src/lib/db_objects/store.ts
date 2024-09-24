import { Timestamp } from "firebase/firestore";

type _DBStore = {
    avatar_filename: string;
    avatar_url: string;
    banner_filename: string;
    banner_url: string;
    country: string;
    description: string;
    name: string;
    owner_id: string;
    password: string;
    password_protected: boolean;
    status: string;
    subscription_count: number;
    users: {
        id: string;
        role: string;
        status: string;
    }[];
    users_list: string[];
    view_count: number;
    created_at: Timestamp;
    updated_at: Timestamp
}
type _DBAnalytic = {
    city: string;
    country: string;
    ip: string;
    region: string;
    store_id: string;
    type: string;
    user_id: string;
    product_id?: string;
    options?: string[];
    quantity?: number;
    revenue?: number;
    created_at: Timestamp;
}
type _DBCollection = {
    description: string;
    name: string;
    owner_id: string;
    products: string[];
    status: string;
    store_id: string;
    tags: string[];
    type: string;
    created_at: Timestamp;
    updated_at: Timestamp
}
type _DBPromotion = {
    amount: number;
    expiration_date: Timestamp;
    minimum_order_value: number;
    name: string;
    number_of_uses: number;
    owner_id: string;
    show_in_banner: boolean;
    status: string;
    times_used: number;
    type: string;
    created_at: Timestamp;
    updated_at: Timestamp
}