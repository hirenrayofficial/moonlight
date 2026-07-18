import User from "@/db/mongodb/usermodule";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import Code from "@/db/mongodb/authbase/codeBase";

import connectDB from "@/db/mongodb/db";


export async function POST(req) {
    const body = await req.json()
    const { username, password ,code} = body
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

    await connectDB();
    const checkCode = await Code.findOne({ email: checkUser.email, code });
    if (!checkCode) {
        return NextResponse.json({ success: false, message: "Code does not match" }, { status: 401 });
    }

    return NextResponse.json({ success: true, valid: true, message: "Code verified" }, { status: 200 });
}


