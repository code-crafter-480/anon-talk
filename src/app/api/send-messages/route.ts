import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { cookies } from "next/headers";


export async function POST(request: Request) {
    await dbConnect()

    // Ai project a message je keu pathate pare so ata check korar dorkar nei je apni loggedIn achen kina...
    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        // is user accepting the messages ?
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages"
                },
                {
                    status: 403
                }
            )
        }

        const newMessage = {content, createdAt: new Date()}   // Now atai User er message array er moddhe push hobe...

        user.messages.push(newMessage as Message)     // 📌 Ekhane assertion na korle error show korbe, In TypeScript, assertions are used to tell the TypeScript compiler to treat a value as a specific type, even if the compiler cannot infer it on its own. There are two main forms of assertions: type assertions and assertion functions.
        // 📌 ami jani ai 'newMessage' dataType, and '@/model/User' ekhane strict instruction a6e je Schema tokhoni nebo jokhon or type 'Message' hobe, and ami jani je 'newMessage' er type 'Message'...
        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error adding messages ", error)
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            {
                status: 500
            }
        )
    }
}