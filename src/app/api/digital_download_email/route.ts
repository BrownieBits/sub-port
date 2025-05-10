
import { DigitalDownloadEmail } from '@/components/sp-ui/EmailTemplates/Order/digitalDownload';
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    const data = await request.json();

    await resend.emails.send({
        from: 'SubPort <no-reply@sub-port.com>',
        to: data.send_to,
        subject: `Your digital downloads from ${data.store_id} are here!`,
        react: DigitalDownloadEmail({
            order_id: data.order_id,
            order_date: data.order_date,
            products: data.products,
        }),
    });

    return new Response('Success!', {
        status: 200,
    });
}