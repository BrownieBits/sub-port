
import FeedbackEmail from "@/components/sp-ui/EmailTemplates/User/feedbackEmail";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    const data = await request.json();

    await resend.emails.send({
        from: 'SubPort <no-reply@sub-port.com>',
        to: process.env.FEEDBACK_EMAIL!,
        subject: `New Feedback Sent`,
        react: FeedbackEmail({
            user_id: data.user_id,
            email: data.email,
            description: data.description,
            file: data.file,
            country: data.country,
            city: data.city,
            region: data.region,
            ip: data.ip,
            created_at: data.created_at,
        }),
    });

    return new Response('Success!', {
        status: 200,
    });
}