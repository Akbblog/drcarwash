// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, email, message } = body;

        if (!name || !phone || !email || !message) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        console.log("[DEBUG] SMTP ENV:", {
            SMTP_HOST: process.env.SMTP_HOST || "not set",
            SMTP_PORT: process.env.SMTP_PORT || "not set",
            MAIL_USER: process.env.MAIL_USER ? "*set*" : "❌ NOT SET",
            MAIL_PASS: process.env.MAIL_PASS ? "*set*" : "❌ NOT SET",
            MAIL_TO: process.env.MAIL_TO ? "*set*" : "❌ NOT SET",
        });

        const smtpPort = parseInt(process.env.SMTP_PORT || "465");

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.hostinger.com",
            port: smtpPort,
            secure: smtpPort === 465, // true for 465 (SSL), false for 587 (TLS)
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Website Contact" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_TO || process.env.MAIL_USER,
            subject: `New message from ${name}`,
            html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error: any) {
        console.error("CONTACT_API_ERROR:", error);
        return NextResponse.json(
            { error: error?.message || "Server error" },
            { status: 500 }
        );
    }
}
