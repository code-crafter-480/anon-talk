import { getServerSession } from "next-auth";       
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth'       // It is not the 'user' which lies in the session...
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)       // ekhane ai session er mane ai noi je 'User' peye ge6i...
    const user: User = session?.user as User

    if (!session || !session.user) {
        console.log("Under '!session || !session.user' this line...")

        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    // const userId = user._id          // ➡️ Model a 'user' amader string type a ache, so mongo aggregation er somoy ata issue create korte pare, so nicher step ta korle issue resolve hoye jabe...
    const userId = new mongoose.Types.ObjectId(user._id)          // ekhane 'userId' er moddhe string er theke convert hoye mongoose er objectId jabe...
    
    try {
        // 📌 Now ekhane amader aggeregation pipeline apply korte hobe, so ekhane amake multiple 'user' create korte hobe, But why we are applying this --> jehetu amader ka6e aktai message array a6e and otai return korte hobe so ekhane problem ho66e jodi amader 5-10k messages hole amra aivabe puro akta array return korte chaibo na, so akhane aggregation pipeline use korbo...
        const user = await UserModel.aggregate([

            { $match: { _id: userId }},         // 📌 Ai vabe jotogulo pipeline chalano dorkar totogulo chalabo... So now ata korar por amader array ke 'unwind' korte hobe ( 🖼️ See 'Pic_3_unwind' )... ai 'unwind' pipeline array er jonno lage, ata array ke open kore debe, mane multiple objects create kore debe... so ata korar fole ami sort korte parbo...
            { $unwind: '$messages' },          // ➡️ akhane 'unwind' amader 'messages' parameter er upor lagate hobe, and jokhoni amra mongodb er internel parameter use kori tokhon direct ai vabe likhte parbo...Now amra sorting korbo...
            { $sort: { 'messages.createdAt': -1 } },       // ➡️ -1: This indicates sorting in descending order (i.e., from newest to oldest)...Now my documents are still scattered, So now we group them...
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },

        ])
        console.log("user in get-messages: ", user )
        console.log("user in get-messages2: ", user.length )

        if (!user) {
            console.log("Under '!user...")
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 401
                }
            )
        }
        if (user.length === 0) {
            console.log("user.length === 0' this line...")
            return Response.json(
                {
                    success: true,
                    message: "No Messages Available"
                },
                {
                    status: 200
                }
            )
        }
    console.log("user data in get-messages: ", user[0])
        // 📌📌📌
        return Response.json(
            {
                success: true,
                message: "Message 555",
                messages: user[0].messages      // ➡️ aggregation pipeline er return type a amra array pai... so array er first object theke messages ke bere kore diye dao...
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("An unexpected error occured: ", error)
        return Response.json(
            {
                success: false,
                message: "Error while fetching messages"
            },
            {
                status: 500
            }
        )
    }
}