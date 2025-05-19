'use server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

export async function RetrievePaymentIntent(intentID: string) {
    'use server';
    const paymentIntent = await stripe.paymentIntents.retrieve(
        intentID
    );
    return paymentIntent;
}