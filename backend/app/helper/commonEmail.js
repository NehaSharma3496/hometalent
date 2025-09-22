var nodemailer = require('nodemailer');
const db = require('../models');
// const User = db.user;

function extractDomain(url) {
    if (url.includes("//")) {
        return url.split("//")[1].split(":")[0];
    }
    return url.split(":")[0];
}

const commonEmail = async (toEmail, subjectEmail, htmlEmail) => {
    try {
     
        console.log("Sending email to:", toEmail);
        console.log("Email subject:", subjectEmail);
        console.log("Email HTML content:", htmlEmail);
        if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
            throw new Error("SMTP configuration is missing in environment variables.");
        }

        console.log("SMTP Host:", process.env.SMTP_HOST);
        console.log("SMTP Port:", process.env.SMTP_PORT);
        console.log("SMTP User:", process.env.SMTP_USER);
        console.log("SMTP Password:", process.env.SMTP_PASSWORD) 
        const transport = nodemailer.createTransport({
            type: "smtp",
            host: process.env.SMTP_HOST.trim(),
            port: process.env.SMTP_PORT.trim(),
            secure: 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER.trim(),
                pass: process.env.SMTP_PASSWORD.trim()
            }
        });
        const mailOptions = {
            from: process.env.SMTP_USER.trim(),
            to: toEmail,
            subject: subjectEmail,
            html: htmlEmail
        };
        await transport.sendMail(mailOptions);
        console.log("Email sent successfully.");
        return true;
       
    } catch (error) {
        console.log("Error sending email:", error);
        return false;
    }
};

module.exports = { commonEmail }
