import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const mailGenerator = new Mailgen({
   theme: "default",
  product: {
    name: "PlacementPortal",
     link: process.env.FRONTEND_URL || "http://localhost:5173/",
  },
 });

/**
 * 2 & 3. Generate reusable mail content
* @param {Object} body - Mailgen email body object (intro, action, outro, etc)
 * @returns {Object} { html, text }
 */
export const generateMailContent = (body) => {
  const emailBody = {
    body: body,
  };

  const html = mailGenerator.generate(emailBody);

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const text = mailGenerator.generatePlaintext(emailBody);

   return { html, text };
};

let transporter;

/**
 * 5. Reusable send email function
 * @param {Object} options
  * @param {String} options.email - Recipient email
 * @param {String} options.subject - Email subject
 * @param {Object} options.mailgenContent - Contains { html, text } generated from Mailgen
 */
export const sendEmail = async ({ email, subject, mailgenContent }) => {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.warn("No RESEND_API_KEY found. Email will not be sent.");
      return null;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev", // Resend default testing address
        to: email,
        subject: subject,
        html: mailgenContent.html,
        text: mailgenContent.text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API Error:", data);
      throw new Error(data.message || "Could not send email via Resend.");
    }

    console.log("Message sent via Resend:", data.id);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email.");
  }
};
