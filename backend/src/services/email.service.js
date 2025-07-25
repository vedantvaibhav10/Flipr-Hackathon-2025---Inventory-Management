const nodemailer = require('nodemailer');
require('dotenv').config();
const colors = require('colors');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Inventory Management" <${process.env.MAIL_FROM}>`,
            to: to,
            subject: subject,
            html: html,
        });
        console.log(`Email sent: ${info.messageId}`.green);
        return info;
    } catch (error) {
        console.error(`Error sending email: ${error.message}`.red);
        throw new Error("Email could not be sent.");
    }
}

module.exports = sendEmail;