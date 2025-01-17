import { getServerSession } from "next-auth";       
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth'       // It is not the 'user' which lies in the session...


export async function DELETE(request: Request, {params}:{params: {messageid: string}}) {     // ata aktu weired part, first a bol6i je amra 'params' pa66i then ai 'params' er moddhe 'params' parameter pabo jeta 'messageid' debe and ai 'messageid' er type string... 
    
    const messageId = params.messageid
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
    try {
        // Model.updateOne(filter, update, options, callback )
        // filter: It is a mongoose object which identifies the existing document to update.
        // update: It is a mongoose object which is the document that will update the data in the existing document.
        const updateResult = await UserModel.updateOne(
            { _id: user._id },     // ai basis a ami match korbo...
            { $pull: { messages: {_id: messageId} } }   // The '$pull' operator removes from an existing array all instances of a value or values that match a specified condition.
            // If the specified <value> to remove is an array, $pull removes only the elements in the array that match the specified <value> exactly, including order.
            // Visualize with this :
            // {
            //     "_id": "123",
            //     "name": "John Doe",
            //     "messages": [
            //         { "_id": "m1", "text": "Hello" },
            //         { "_id": "m2", "text": "Hi there" },
            //         { "_id": "m3", "text": "Goodbye" }
            //     ]
            // }
        )
        if(updateResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                }, 
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message Deleted"
            }, 
            { status: 200 }
        )

    } catch (error) {
        console.log("Error in delete message route", error)
        return Response.json(
            {
                success: false,
                message: "Error deleting message"
            }, 
            { status: 500 }
        )
    }

    

}