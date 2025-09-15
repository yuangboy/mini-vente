import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_SMTP_HOST,
    port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
    service: process.env.NEXT_PUBLIC_SMTP_SERVICE,
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_EMAIL,
      pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  const html: string = await ejs.renderFile(
    path.join(__dirname, "../mails", template),
    data
  );

  const mailOptions = {
    from: process.env.NEXT_PUBLIC_SMTP_EMAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
