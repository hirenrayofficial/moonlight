import nodemailer from 'nodemailer'


export const codeSend = async({email,code})=>{
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.NEXT_APP_SMPT_USER,
                pass: process.env.NEXT_APP_SMPT_PASS,
            },
        });

        const mailOptions = {
            from: process.env.NEXT_APP_SMPT_USER,
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${code}`,
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Verification code sent successfully.' };
    } catch (error) {
        console.error('Error sending verification code:', error);
        return { success: false, message: 'Failed to send verification code.' };
    }
} 