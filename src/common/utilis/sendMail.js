import nodemailer from "nodemailer";
import { EMAIL, PASS, TOEMAIL } from "../../../config/config.service.js";
// import { resolve } from "node:path"

export const sendMail = async ({ to, subject, html, attachment }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL,
            pass: PASS
        },
    });

    const info = await transporter.sendMail({
        from: `I am here <${EMAIL}>`,
        to: to || TOEMAIL,
        subject: subject || "Hello",
        html: html || "<b>Hello world?</b>"
        // attachments: [
        //     {
        //         filename: "",
        //         path: resolve()
        //     }
        // ]
    });

    console.log("Message sent: %s", info.messageId);
    return info.accepted.length > 0 ? true : false
}


export const generateOtp = () => {
    return Math.floor(Math.random() * 900000 + 100000)
}