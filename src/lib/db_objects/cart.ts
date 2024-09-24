import { Timestamp } from "firebase/firestore";
import { _DBAddress } from "./address";

type _DBCart = {
    address: _DBAddress | null;
    billing_address: _DBAddress | null;
    email: string;
    items: number;
    owner_email: string | null;
    owner_id: string | null;
    payment_intent: string;
    shipments: {
        [key: string]: {
            error: string | null;
            items: {
                cart_item_id: string;
                compare_at: number;
                currency: string;
                dimensions: {
                    height: number;
                    width: number;
                    length: number;
                    units: string
                };
                id: string;
                images: string[];
                inventory: number;
                name: string;
                options: string[];
                price: number;
                product_type: string;
                quantity: number;
                service_percent: number;
                ship_from: string;
                store_id: string;
                track_inventory: boolean;
                vendor: string;
                weight: {
                    units: string;
                    value: number;
                };

            }[];
            rate: {
                carrier_id: string;
                carrier_name: string;
                delivery_days: number;
                estimated_delivery_date: Timestamp;
                rate: number;
                service_code: string;
                service_type: string;
            };
            ship_from: _DBAddress | null;
            ship_to: _DBAddress | string;
            store_avatar: string;
            store_name: string
        }
    } | null;
    created_at: Timestamp;
    updated_at: Timestamp
}
type _DBItem = {
    options: string[];
    quantity: number;
    store_id: string;
    created_at: Timestamp;
}