'use server'

import { revalidatePath } from "next/cache";

export async function revalidate(product_id: string) {
    'use server';
    revalidatePath(`/product/${product_id}`);
}