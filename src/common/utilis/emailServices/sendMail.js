import nodemailer from "nodemailer";
import { EMAIL, PASS, TOEMAIL } from "../../../../config/config.service.js";

export const sendMail = async ({ to, subject, html, attachment }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        tls: { rejectUnauthorized: false },
        auth: {
            user: EMAIL,
            pass: PASS
        },
    });

    const info = await transporter.sendMail({
        from: `SARAHA APP <${EMAIL}>`,
        to: to || TOEMAIL,
        subject: subject || "Hello",
        html: html || "<b>Hello world?</b>",
        attachment: attachment || []
    });

    console.log("Message sent: %s", info.messageId);
    return info.accepted.length > 0 ? true : false
}


export const generateOtp = () => {
    return Math.floor(Math.random() * 900000 + 100000)
}