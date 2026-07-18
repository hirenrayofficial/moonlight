




import { sendEnquiryEmail } from "../../../../services/admin/mailer.js";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log(data)

        // Validate required fields
        if (!data.name || (!data.email && !data.phone)) {
            return new Response(JSON.stringify({
                success: false,
                message: "Name and either email or phone is required"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Send enquiry email
        await sendEnquiryEmail(data);

        console.log("Enquiry received and email sent:", data);

        return new Response(JSON.stringify({
            success: true,
            message: "Enquiry received successfully. We'll contact you shortly!"
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error processing enquiry:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Failed to process enquiry. Please try again or call us directly."
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}