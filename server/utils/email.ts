// utils/email.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_API_KEY!,
    pass: process.env.EMAIL_API_KEY!
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_SENDER!,
    to: email,
    subject: 'Verify Your Email',
    text: `Please click the following link to verify your email: ${verificationUrl}`,
    html: `
      <p>Please click the following link to verify your email:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};
