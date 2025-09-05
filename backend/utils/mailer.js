import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, 
        },
        secure: true, 
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: `"Google Docs Clone" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.messageId);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};
