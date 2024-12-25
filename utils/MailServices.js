const nodemailer = require('nodemailer');
const CustomError = require('./ErrorHandler');
const { STATUS_CODES } = require('./constants');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendConfirmationMail = async (username, email) => {
    const url = `http://localhost:${process.env.PORT}/api`;

    const confirmationLink = `${url}/confirm-email?email=${email}`;

    const payload = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Registration Confirmation",
        text: `Hi, ${username}! \n\n Please click the following link to confirm your account : \n${confirmationLink}`,
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <h4>Dear ${username},</h4>
                    <p>Thank you for registering with us! Please activate your account by clicking the link below:</p>
                    <p><a href="${confirmationLink}" style="color: #042DC3FF; font-size: 16px; font-weight: bold;">Activate My Account</a></p>
                    <h5>To activate your account</h5>
                    <p>If you did not create an account, no action is required.</p>
                    <p><em>If you have any questions, feel free to contact our support team at ${process.env.SUPPORT_EMAIL}.</em></p>
                </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(payload);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error("Error while sending email..!", error);
        throw new CustomError(STATUS_CODES.FORBIDDEN, `Failed to send email: ${error.message}`);
    }
};

module.exports = { sendConfirmationMail };
