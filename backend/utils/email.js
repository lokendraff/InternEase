const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTPEmail = async (userEmail, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Verify your InternEase Account',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Welcome to InternEase! 🚀</h2>
                    <p>Your One-Time Password (OTP) for registration is:</p>
                    <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 10 minutes. Please do not share it with anyone.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: ' + info.response);
        return true;
    } catch (error) {
        console.error("Nodemailer Error:", error);
        return false;
    }
};

module.exports = { sendOTPEmail };