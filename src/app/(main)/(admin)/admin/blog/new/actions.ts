'use server';
import { redirect } from "next/navigation";

export async function goTo(url: string) {
    redirect(url);
}