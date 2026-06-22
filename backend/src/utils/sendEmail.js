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
    if (!transporter) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
       },
      });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"PlacementPortal" <noreply@placementportal.com>',
      to: email,
      subject: subject,
       html: mailgenContent.html,
      text: mailgenContent.text,
    };

    const info = await transporter.sendMail(mailOptions);
   console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email.");
  }
};
