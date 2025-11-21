// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    /* ---------------------------------
       ▲  **Diagnostic section**          ▲
       --------------------------------- */
    // If any of these are empty, log them so you see the exact values
    console.log("[DEBUG] SMTP ENV:", {
      MAIL_USER: process.env.MAIL_USER ? "*set*" : "❌ NOT SET",
      MAIL_PASS: process.env.MAIL_PASS ? "*set*" : "❌ NOT SET",
      MAIL_TO: process.env.MAIL_TO ? "*set*" : "❌ NOT SET",
    });

    /* ---------------------------------
       End of diagnostic section          ▼
       --------------------------------- */

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 587, // TLS (STARTTLS) – not blocked by Hostinger
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      // If your host forces TLS renegotiation you may need:
      // tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: `"Website Contact" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: `New message from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
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