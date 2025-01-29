
import { NewOrderCustomer } from '@/components/sp-ui/EmailTemplates/Order/newOrderCustomer';
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    const data = await request.json();

    await resend.emails.send({
        from: 'SubPort <no-reply@sub-port.com>',
        to: data.send_to,
        subject: `New Order: ${data.order_id}`,
        react: NewOrderCustomer({
            order_id: data.order_id,
            order_date: data.order_date,
            tracking_id: data.tracking_id,
            order_address: data.order_address,
            order_name: data.order_name,
            currency: data.currency,
            products: data.products,
        }),
    });

    return new Response('Success!', {
        status: 200,
    });
}