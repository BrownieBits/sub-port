'use server';
import { headers } from "next/headers";

export async function getCountry() {
    'use server';
    const country = headers().get('x-geo-country') as string;
    return country;
}