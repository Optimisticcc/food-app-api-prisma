import nodemailer, { SendMailOptions } from 'nodemailer';
import env from '../configs/env';

const mailHost = 'smtp.gmail.com';
const mailPort = 587;

export const sendMail = (job: any) => {
  const {to, subject, message} = job
  const transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false,
    auth: {
      user: env.emailAdmin,
      pass: env.passwordAdmin,
    },
  });

  const options: SendMailOptions = {
    from: env.emailAdmin, // địa chỉ admin email bạn dùng để gửi
    to: to, // địa chỉ gửi đến
    subject: subject, // Tiêu đề của mail
    html: message,
  };
  return transporter.sendMail(options);
};
