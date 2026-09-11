
import { NextResponse } from "next/server";
import { sendQueryEmail } from "@/services/admin/mailer";
export async function POST(req) {
    try {
        const body = await req.json();

        const {
            customerName,
            customerContact,
            message,
            productName,
            productSku,
        } = body;


        // Validation
        if (!customerName?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Customer name is required",
                },
                { status: 400 }
            );
        }


        if (!customerContact?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Customer contact number is required",
                },
                { status: 400 }
            );
        }


        if (!productName?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product name is required",
                },
                { status: 400 }
            );
        }


        // Send email
        await sendQueryEmail({
            customerName: customerName.trim(),
            customerContact: customerContact.trim(),
            message: message?.trim() || "",
            productName: productName.trim(),
            productSku: productSku?.trim() || "",
        });


        return NextResponse.json(
            {
                success: true,
                message: "Your query has been sent successfully.",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Product query API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to send your query. Please try again.",
            },
            { status: 500 }
        );
    }
}

