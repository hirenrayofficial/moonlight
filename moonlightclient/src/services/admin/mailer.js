import nodemailer from "nodemailer";

/**
 * Mail Service for Moonlight Machinery
 * Sends enquiry emails using nodemailer
 */

// Create transporter


/**
 * Send enquiry email to admin
 * @param {Object} enquiry - Enquiry data
 * @returns {Promise}
 */
export async function sendEnquiryEmail(enquiry) {
    const {
        name,
        phone,
        email,
        machine,
        message,
    } = enquiry;
    console.log(enquiry)

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.NEXT_APP_SMPT_USER,
                pass: process.env.NEXT_APP_SMPT_USER,
            },
        });

        // Email to admin
        const adminMailOptions = {
            from: process.NEXT_APP_SMPT_USER,
            to: process.NEXT_APP_SMPT_TO_USER,
            subject: `New Machine Enquiry from ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">New Machine Enquiry</h2>
            
            <div style="margin-bottom: 15px;">
              <p style="color: #666; margin: 0;"><strong>Name:</strong> ${name}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${email || "Not provided"}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Machine of Interest:</strong> ${machine}</p>
            </div>

            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #333; margin: 0;"><strong>Message:</strong></p>
              <p style="color: #666; margin: 10px 0; line-height: 1.6;">${message || "No message provided"}</p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">This is an automated email from your website contact form.</p>
            </div>
          </div>
        </div>
      `,
            text: `
New Machine Enquiry

Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}
Machine of Interest: ${machine}

Message:
${message || "No message provided"}
      `,
        };

        // Confirmation email to user
        const userMailOptions = {
            from: process.NEXT_APP_SMPT_USER,
            to: email || phone, // In case email is not provided, we still need to know where to send
            subject: "We received your enquiry - Moonlight Machinery",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Thank You, ${name}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We've received your enquiry about the <strong>${machine}</strong> and will get back to you shortly.
            </p>

            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #333; margin: 0;"><strong>Your Enquiry:</strong></p>
              <p style="color: #666; margin: 10px 0; line-height: 1.6;">${message || "No additional message"}</p>
            </div>

            <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333;">
              <p style="color: #333; margin: 0 0 10px 0;"><strong>Quick Contact Options:</strong></p>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li style="margin: 5px 0;">Call us at: +91 8178445596</li>
                <li style="margin: 5px 0;">WhatsApp: +918178445596</li>
                <li style="margin: 5px 0;">Email: sales@moonlightmachinery.com</li>
                <li style="margin: 5px 0;">Hours: Mon–Sat, 9am–7pm IST</li>
              </ul>
            </div>

            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              © 2024 Moonlight Machinery. All rights reserved.
            </p>
          </div>
        </div>
      `,
            text: `
Thank you, ${name}!

We've received your enquiry about the ${machine} and will get back to you shortly.

Your Enquiry:
${message || "No additional message"}

Quick Contact Options:
- Call us at: +91 8178445596
- WhatsApp: +918178445596
- Email: sales@moonlightmachinery.com
- Hours: Mon–Sat, 9am–7pm IST

© 2024 Moonlight Machinery. All rights reserved.
      `,
        };

        // Send both emails
        await transporter.sendMail(adminMailOptions);

        if (email) {
            await transporter.sendMail(userMailOptions);
        }

        return { success: true, message: "Enquiry sent successfully" };
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}
