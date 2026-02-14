import { sendEmail, sendWhatsApp } from "../utils/sendNotifications.js";

export const notifyUser = async (email, phone, message) => {
  try {
    await sendEmail(email, "Complaint Update", message);
    await sendWhatsApp(phone, message);
  } catch (err) {
    console.error("Notification failed:", err.message);
  }
};
