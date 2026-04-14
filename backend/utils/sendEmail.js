const nodemailer = require('nodemailer');

// It sends an email to the given address using Gmail
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"MindCare" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions); 
  console.log(`Email sent successfully to: ${to}`);
};

module.exports = sendEmail;