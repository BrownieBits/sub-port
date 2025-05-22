
import NewPayout from '@/components/sp-ui/EmailTemplates/Order/newPayout';
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    const data = await request.json();

    await resend.emails.send({
        from: 'SubPort <no-reply@sub-port.com>',
        to: data.send_to,
        subject: `Cha-Ching! Your SubPort Store Just Got Paid!`,
        react: NewPayout({
            order_id: data.order_id,
            payout_total: data.payout_total,
        }),
    });

    return new Response('Success!', {
        status: 200,
    });
}