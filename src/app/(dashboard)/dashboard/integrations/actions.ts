'use server';


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

export async function CreateStripeAccount(user_id: string, country: string, email: string, default_currency: string) {
    'use server';
    const account = await stripe.accounts.create({
        controller: {
            stripe_dashboard: {
                type: "none",
            },
            fees: {
                payer: "application"
            },
            losses: {
                payments: "application"
            },
            requirement_collection: "application",
        },
        capabilities: {
            transfers: { requested: true }
        },
        country: country,
        email: email,
        default_currency: default_currency
    });

    return account.id;
}
export async function CreateStripeLinkURL(account_id: string) {
    'use server';
    const accountLink = await stripe.accountLinks.create({
        account: account_id,
        refresh_url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/stripe/${account_id}`,
        return_url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/stripe/${account_id}`,
        type: "account_onboarding",
    });

    return accountLink.url;
}
