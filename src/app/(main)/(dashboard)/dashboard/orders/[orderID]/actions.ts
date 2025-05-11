'use server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function goTo() {
    'use server';
    redirect('/dashboard/orders');
}

export async function revalidate(url: string) {
    'use server';
    revalidatePath(url);
}