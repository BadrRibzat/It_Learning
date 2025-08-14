import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'apikey',     // IMPORTANT
    pass: process.env.EMAIL_PASS!                 // your Brevo API key
  }
});

export const sendVerificationEmail = async (email: string, verifyLink: string) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER!,
    to: email,
    subject: 'Verify Your Email',
    text: `Please click the following link to verify your email: ${verifyLink}`,
    html: `<p>Please click the following link to verify your email:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`
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

