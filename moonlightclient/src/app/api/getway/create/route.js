import { getDb } from "@/lib/mongodb";
import bcrypt from 'bcryptjs';
import User from "@/db/mongodb/usermodule"; // Ensure your Mongoose model is imported
import connectDB from "@/db/mongodb/db";

export async function POST(request) {
    const email = "admin@moonlightmachinery.com"
    try {
        const body = await request.json();
        const { username, password, hp_field } = body;

        // 1. Simple Honeypot Check (Anti-bot)
        if (hp_field) {
            return Response.json({ message: "Invalid request" }, { status: 400 });
        }

        // 2. Validate input
        if (!username || !password) {
            return Response.json({ message: "Username and password required" }, { status: 400 });
        }

        // 3. Connect to Database
        await connectDB();

        // 4. Hash Password (bcrypt.hash requires an await)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 5. Create and save User
        const user = new User({
            username,
            password: hashedPassword,
            email: email,
        });

        await user.save();

        return Response.json({ message: "User created successfully" }, { status: 201 });

    } catch (error) {
        console.error("Signup error:", error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}