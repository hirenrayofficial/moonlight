import User from "@/db/mongodb/usermodule";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import Code from "@/db/mongodb/authbase/codeBase";
import { genrateCode }  from '@/services/home/Genratecode'
import connectDB from "@/db/mongodb/db";
import { codeSend } from "@/services/admin/noadmailer/noadmailer";


export async function POST(req) {
    const body = await req.json()
    const { username, password } = body
    console.log(body)

    if (!username || !password) {
        return NextResponse.json({ success: false, message: "Invalid field" }, { status: 400 })
    }

    const checkUser = await User.findOne({ username });
    console.log(checkUser)
    if (!checkUser) {
        return NextResponse.json({ success: false, message: 'Username not valid' }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch) {
        return NextResponse.json({ success: false, message: 'Wrong password' }, { status: 401 });
    }

    const code = await genrateCode();
    if (!code) {
        return NextResponse.json({ success: false, message: "Code not generated" }, { status: 500 });
    }

    await connectDB();
    const savedCode = new Code({
        email: checkUser.email,
        code,
        createdAt: Date.now(),
    });
    await savedCode.save();

    const emaildens = await codeSend({ email: savedCode.email, code: savedCode.code });
    if (!emaildens) {
        return NextResponse.json({ success: false, message: "Code generation unsuccessful" }, { status: 500 });
    }

    return NextResponse.json({ success: true, valid: true, message: "Code sent to your mail" }, { status: 200 });
}


