import nodemailer from "nodemailer";

export async function send2FACode(email: string, code: string) {
  // ⭐ Correct transporter — works locally AND on Vercel
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,   // ⭐ Auto-correct SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // ⭐ Optional: SMTP connection test (helps debugging)
  try {
    await transporter.verify();
    console.log("SMTP connection OK");
  } catch (err) {
    console.error("SMTP connection FAILED:", err);
  }

  // ⭐ Send the actual 2FA code
  await transporter.sendMail({
    from: `"26Scan" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your 26Scan Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is:</p><h2>${code}</h2>`
  });

  console.log("2FA code sent to:", email);
  return true;
}
