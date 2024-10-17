'use server';
import { headers } from "next/headers";

export async function getCountry() {
    'use server';
    const country = (await headers()).get('x-geo-country') as string;
    return country;
}