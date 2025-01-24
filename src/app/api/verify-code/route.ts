import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, code} = await request.json()

        const decodeUsername = decodeURIComponent(username)        // Note available in bottom...
        const user = await UserModel.findOne({username: decodeUsername})
        
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 500
                }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                {
                    status: 200
                }
            )
        } else if ( !isCodeNotExpired ) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired, please signup again to get a new code"
                },
                {
                    status: 400
                }
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Verification code"
                },
                {
                    status: 400
                }
            )
        }
    } catch (error) {
        console.log("Error verifying user", error)
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            {
                status: 500
            }
        )
    }
}


/*
📌 The decodeURIComponent function in JavaScript is used to decode a URI (Uniform Resource Identifier) component that has been encoded. URI encoding replaces certain characters with their percent-encoded representation to ensure that the URI can be safely transmitted over the internet.

👉 Basic Concept:
    ➡️ Encoding: Converts special characters into a format that can be transmitted (e.g., %20 for a space).
    ➡️ Decoding: Converts the encoded representation back to its original form.

    const original = "Hello World!";
    const encoded = encodeURIComponent(original);
    console.log(encoded); // Output: "Hello%20World%21"


👉 Key Points:
    ➡️ decodeURIComponent: Converts percent-encoded characters back to their original characters.
    Common Usage: Used to decode query parameters, paths, or any URI components that have been encoded for safe transmission.
*/