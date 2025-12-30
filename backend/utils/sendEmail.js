const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        // Create  Connection to Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Gmail from .env
                pass: process.env.EMAIL_PASS, // Password from .env
            },
        });

        // The Mail Options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
        };

        await transporter.sendMail(mailOptions);
        
        // This is  to see if it worked in the terminal or not
        console.log(`Email sent successfully to: ${to}`);
        
    } catch (error) {
        console.error("Email Error:", error);
    }
};

module.exports = sendEmail;
