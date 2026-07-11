import User from "@/db/mongodb/usermodule";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import Code from "@/db/mongodb/authbase/codeBase";

import connectDB from "@/db/mongodb/db";


export async function POST(req) {
    const body = await req.json()
    const { username, password ,code} = body
    console.log(body)

    if (!username, !password) {
        return NextResponse.json({ message: "invalied field" }, { status: 400 })
    }
    const checkUser = await User.findOne({ username: username })
    console.log(checkUser)
    if (!checkUser) {
        return NextResponse.json({ message: 'username not valied' }, { status: 500 })
    }



    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch) return fail('wrong_password');

    await connectDB()
    const checkCode = await Code.findOne({email:checkUser.email,code:code})
    if(!checkCode){
        return NextResponse.json({ message: "Code not match", }, { status: 500 })
    }
    return NextResponse.json({ message: "Code send Your mail", }, { status: 200 })
}


