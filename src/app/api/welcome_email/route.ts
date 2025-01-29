
import { NikeReceiptEmail } from '@/components/sp-ui/EmailTemplates/digitalDownload';
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    const data = await request.json();

    await resend.emails.send({
        from: 'SubPort <no-reply@sub-port.com>',
        to: 'ian.scot.brown@gmail.com',
        subject: `New Order: ${data.order_id}`,
        react: NikeReceiptEmail({ order_id: data.order_id }),
    });

    return new Response('Success!', {
        status: 200,
    });
}