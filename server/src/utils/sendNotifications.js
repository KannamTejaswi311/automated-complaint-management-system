// utils/sendNotifications.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env file

// 🟩 Replace these with your actual Gmail + App Password
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS; // Use Gmail App Password, not your real password

// 🟢 Function to send real email notifications
export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Smart College Complaint System" <${EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent successfully to ${to}`);
  } catch (err) {
    console.error("❌ Email send error:", err.message);
  }
};

// 🔹 Simulated WhatsApp (no Twilio)
export const sendWhatsApp = async (to, message) => {
  console.log(`💬 Simulated WhatsApp: To=${to}, Message=${message}`);
};
