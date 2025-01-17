import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){      // 'request' er datatype 'Request' and ai 'Request' nextjs thekei ase...
    await dbConnect()

    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({          // ai nicher duto 'and' operation hisabe treat korbe...
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            },
            {
                status: 400  
            })
        }

        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, {status: 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const expirydate = new Date()          // 📌 ekhane ai 'expirydate' akta object, so object er age let/const jai hok na kano, object memory er moddhe puro akta reference point(a area) oi area re inside a value change hote thake, so tai porer line a amra 'expirydate' a 'const' thaka sotteo modify korte par6i... 
            expirydate.setHours(expirydate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expirydate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [] 
            })

            await newUser.save()
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username, 
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, {status: 201})

    } catch (error) {
        console.error("Error registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}