'use server';
import { revalidatePath } from "next/cache";

export async function revalidate(id: string) {
    'use server';
    revalidatePath(`/admin/blog/${id}`);
}