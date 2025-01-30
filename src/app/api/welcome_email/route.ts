
import { WelcomeEmail } from '@/components/sp-ui/EmailTemplates/User/welcome';
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    const data = await request.json();

    await resend.emails.send({
        from: 'SubPort <no-reply@sub-port.com>',
        to: data.send_to,
        subject: `Welcome to SubPort`,
        react: WelcomeEmail(),
    });

    return new Response('Success!', {
        status: 200,
    });
}