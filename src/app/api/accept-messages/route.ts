import { getServerSession } from "next-auth";       
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth'       // It is not the 'user' which lies in the session...


export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)       // ekhane ai session er mane ai noi je 'User' peye ge6i...
    const user: User = session?.user as User

/*
    as User:
        ➡️ This is a TypeScript type assertion that tells the TypeScript compiler to treat session?.user as a User type.
        ➡️ Type assertions are used when you are confident about the type of a value but TypeScript cannot infer it correctly on its own.
*/
    if (!session || !session.user) {
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

    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept messages"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            {
                status: 500
            }
        )
    }

}


export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)       // ekhane ai session er mane ai noi je 'User' peye ge6i...
    const user: User = session?.user as User

    if (!session || !session.user) {
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

    const userId = user._id ;
    
    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
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

        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "Error is getting message acceptance status"
            },
            {
                status: 500
            }
        )
    }
}







/*
🔖 'getServerSession' provided by next-auth is a function used in Next.js applications to retrieve the session information of a currently authenticated user on the server side.

➡️ Simplified Explanation:
    🟢 Session: A session is a way to store user information (like login status) between requests. It helps the server know which user is making the request.
    🟢 Server-Side Retrieval: 'getServerSession' allows you to access this session data directly from the server, which is useful for server-rendered pages or API routes where you need to check if a user is logged in and retrieve their details.

*/