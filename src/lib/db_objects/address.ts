import { Timestamp } from "firebase/firestore";

type _DBAddress = {
    address_line1: string;
    address_line2: string;
    address_line3: string;
    address_residential_indicator: string;
    city_locality: string;
    company_name: string | null;
    country_code: string;
    email: string;
    name: string;
    owner_id: string;
    phone: string;
    postal_code: string;
    state_province: string;
    created_at: Timestamp;
    updated_at: Timestamp
}
export type { _DBAddress };
