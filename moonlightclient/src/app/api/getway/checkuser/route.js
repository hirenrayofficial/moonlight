import User from "@/db/mongodb/usermodule";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import Code from "@/db/mongodb/authbase/codeBase";
import { genrateCode }  from '@/services/home/Genratecode'
import connectDB from "@/db/mongodb/db";


export async function POST(req) {
    const body = await req.json()
    const { username, password } = body
    console.log(body)

    if (!username, !password) {
        return NextResponse.json({ message: "invalied field" }, { status: 400 })
    }
    const checkUser =await  User.findOne({ username:username })
    console.log(checkUser)
    if (!checkUser) {
        return NextResponse.json({ message: 'username not valied' },{status: 500})
    }



  const isMatch = await bcrypt.compare(password, checkUser.password);
  if (!isMatch) return fail('wrong_password');

    // if (!matchPass) {
    //     return NextResponse.json({ message: "Password not match" },{status:500})
    // }
    //genrate code //
    const code = await genrateCode()
    if(!code){
        return NextResponse.json({ message: "Code not genrate" },{status:500})
    }
    await connectDB()
    const savedCode =  new Code({
        email:checkUser.email,
        code:code,
        createdAt: Date.now()
    })
    await savedCode.save()
    console.log(savedCode.code)
    if(!savedCode){
        return NextResponse.json({ message: "Code  genrate Unsuccesfull" },{status:500})
    }
    return NextResponse.json({message: "Code send Your mail",},{status:200})
}


