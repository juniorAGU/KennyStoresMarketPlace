import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (email,otp) => {
    await transporter.sendMail({
        from: `KennyStores <${process.env.EMAIL_USER} >`,
        to: email,
        subject: 'Password Reset Code',
        html: `
                <div style="font-family: Arial; max-width: 400px; margin: auto;">
                    <h2>Reset Your Password</h2>
                    <p>Your verification code is:</p>
                    <h1 style="letter-spacing: 8px; text-align: center;">${otp}</h1>
                    <p>This code expires in <strong>2 minutes</strong>.</p>
                    <p>If you didn't request this, ignore this email.</p>
                </div>
        `
    })

}