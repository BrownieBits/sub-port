import { Timestamp } from "firebase/firestore";

type _DBUser = {
    name: string;
    email: string;
    stores: string[];
    default_store: string;
    addresses: string[];
    default_address: string;
    ccs: string[];
    default_cc: string;
    default_currency: string;
    role: string;
    plan: string;
    country: string;
    stripe_charges_enabled: boolean;
    stripe_connect_id: string;
    stripe_details_submitted: boolean;
    stripe_payouts_enabled: boolean;
    created_at: Timestamp;
    updated_at: Timestamp
}
type _DBLikes = {
    date: Timestamp;
}
type _DBSubscribes = {
    date: Timestamp;
}