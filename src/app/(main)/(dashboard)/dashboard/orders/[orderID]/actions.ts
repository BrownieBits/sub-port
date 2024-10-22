import { redirect } from "next/navigation";

export async function goTo() {
    redirect('/dashboard/orders');
}