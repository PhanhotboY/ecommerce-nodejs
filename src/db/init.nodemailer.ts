import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.DEV_SMTP_USER,
    pass: process.env.DEV_SMTP_PASSWORD,
  },
});

export { transporter };
