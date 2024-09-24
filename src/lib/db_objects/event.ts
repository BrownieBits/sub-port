import { Timestamp } from "firebase/firestore";

type _DBEvent = {
    city: string;
    country: string;
    ip: string;
    region: string;
    type: string;
    user_id: string;
    created_at: Timestamp;
}