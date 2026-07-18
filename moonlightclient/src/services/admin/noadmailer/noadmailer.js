import nodemailer from 'nodemailer'


export const codeSend = async({email,code})=>{
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER ||  "ifyouthinkiamher@gmail.com",
                pass: process.env.SMTP_PASS || "hjuw wjls rbsf mkpz ",
            },
        });

        const mailOptions = {
            from: process.env.SMTP_FROM,
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