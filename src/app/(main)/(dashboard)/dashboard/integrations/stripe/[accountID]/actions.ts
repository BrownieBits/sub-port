'use server';


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

export async function RetrieveStripeAccount(account_id: string) {
    'use server';
    const account = await stripe.accounts.retrieve(account_id);
    return account;
}
export async function CreateStripeLinkURL(account_id: string) {
    'use server';
    const accountLink = await stripe.accountLinks.create({
        account: account_id,
        refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/stripe/${account_id}`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/stripe/${account_id}`,
        type: "account_onboarding",
    });

    return accountLink.url;
}
