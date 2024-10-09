'use server';

import { _Address } from "@/stores/cartStore.types";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

export async function CreatePaymentIntent(customerID: string, cart_total: number, cart_id: string) {
    'use server';
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(cart_total * 100),
        currency: "USD",
        customer: customerID,
        metadata: {
            order_id: cart_id,
        },
    });
    return paymentIntent;
}

export async function RetrievePaymentIntent(intentID: string) {
    'use server';
    const paymentIntent = await stripe.paymentIntents.retrieve(
        intentID
    );
    return paymentIntent;
}

export async function UpdatePaymentIntent(intentID: string, cart_total: number, cart_id: string) {
    'use server';
    const paymentIntent = await stripe.paymentIntents.update(
        intentID,
        {
            amount: Math.round(cart_total * 100),
            metadata: {
                order_id: cart_id,
            },
        }
    );
    return paymentIntent;
}

export async function CreateCustomer(shipping_address: _Address, billing_address: _Address) {
    'use server';
    const customers = await stripe.customers.list({
        email: shipping_address.email,
        limit: 1,
    });
    if (customers.data.length === 0) {
        const customer = await stripe.customers.create({
            name: shipping_address.name,
            email: shipping_address.email,
            phone: shipping_address.phone,
            address: {
                line1: billing_address.address_line1,
                city: billing_address.city_locality,
                country: billing_address.country_code,
                line2: billing_address.address_line2,
                postal_code: billing_address.postal_code,
                state: billing_address.state_province,
            },
            shipping: {
                name: shipping_address.name,
                address: {
                    line1: shipping_address.address_line1,
                    city: shipping_address.city_locality,
                    country: shipping_address.country_code,
                    line2: shipping_address.address_line2,
                    postal_code: shipping_address.postal_code,
                    state: shipping_address.state_province,
                }
            }
        });
        return customer;
    } else {
        let updatesNeeded = false;

        if (
            customers.data[0].address.line1 !== billing_address.address_line1 ||
            customers.data[0].address.line2 !== billing_address.address_line2 ||
            customers.data[0].address.city !== billing_address.city_locality ||
            customers.data[0].address.country !== billing_address.country_code ||
            customers.data[0].address.state !== billing_address.state_province ||
            customers.data[0].address.state !== billing_address.state_province
        ) {
            updatesNeeded = true
        }
        if (
            customers.data[0].shipping.address.line1 !== shipping_address.address_line1 ||
            customers.data[0].shipping.address.line2 !== shipping_address.address_line2 ||
            customers.data[0].shipping.address.city !== shipping_address.city_locality ||
            customers.data[0].shipping.address.country !== shipping_address.country_code ||
            customers.data[0].shipping.address.state !== shipping_address.state_province ||
            customers.data[0].shipping.address.state !== shipping_address.state_province ||
            customers.data[0].shipping.name !== shipping_address.name
        ) {
            updatesNeeded = true
        }
        if (customers.data[0].phone !== shipping_address.phone || customers.data[0].name !== shipping_address.name) {
            updatesNeeded = true
        }

        if (updatesNeeded) {
            const customer = await stripe.customers.update(
                customers.data[0].id,
                {
                    name: shipping_address.name,
                    email: shipping_address.email,
                    phone: shipping_address.phone,
                    address: {
                        line1: billing_address.address_line1,
                        city: billing_address.city_locality,
                        country: billing_address.country_code,
                        line2: billing_address.address_line2,
                        postal_code: billing_address.postal_code,
                        state: billing_address.state_province,
                    },
                    shipping: {
                        name: shipping_address.name,
                        address: {
                            line1: shipping_address.address_line1,
                            city: shipping_address.city_locality,
                            country: shipping_address.country_code,
                            line2: shipping_address.address_line2,
                            postal_code: shipping_address.postal_code,
                            state: shipping_address.state_province,
                        }
                    }
                }
            );
            return customer;
        } else {
            return customers.data[0];
        }

    }


}
