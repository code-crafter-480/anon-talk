import { NextAuthOptions } from "next-auth" 
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

// Here we use 'Credential Providers' from 'NextAuth.js'

export const authOptions: NextAuthOptions = {          // ekhane 'authOptions' er type ho66e 'NextAuthOptions'
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{                     // It is necessary... 
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if (!user) {
                        throw new Error("No user found with this email")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)       // Upore 'email' or 'username' amra 'credential.identifier' er sahajje pabo but password amra directly peye jabo(console.log kore bojha jabe)...  
                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect Password")
                    }
                } catch (err: any) {
                    throw new Error(err)            // amake ki6u return kortei hoto, seta 'if' ei hok ba 'else' ei hok... tai aikhettre ami 'else' part khettre 'error' 'throw' kor6i...
                }
            }
        })                     
    ],


    callbacks: {
        // 📌 Token a besi interesting things thake na, shudu user er id thake, ami chai je ai 'token' ke aro powerful banate jate ai token theke jei value dorkar sei value pete pari... er fole 'payload' er size bere jabe, oneke optimization er jonno 'token' ke short rakhe and amader ai case 'token' ke short rakhle bar bar database queries marte hobe, so amra ai 'token' er moddhe maximum to maximum data insert kore debo, and akbar ai data 'token' er moddhe diye dile 'session' er moddheo diye debo, amar ka6e 'token' ba 'session' jai takhuk na kano ami tar moddhe theke value ber korte parbo... So now 'token' and 'session' ke powerful korte hobe...
        async jwt({ token, user }) {     
            if (user) {
                token._id = user._id?.toString()           //📌 Now ekhane 'user' er moddhe theke kono value ber korte chaile amake ber korte debe na, Main reason hoe66e ekhane joto type defined a6e, 'user' nile 'nextAuth' er 'user' nao but ekhane ami nije theke 'user' a ki6u field add kore6i so oi field er bapare 'nextAuth' jane na... So 'types' folder a ki6u tricky khelte hobe, and 'types' folder 'Nextjs' a akta special type folder, and akta 'next-auth.d.ts' folder create korte hobe and ki6u type defined korte hobe... 
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }         
          return token
        },
        async session({ session, token }) {
            // ➡️ Now 'session' er khettreo same kaj korte hobe...mane 'session' keo to bola hoi ne je 'user' to aste pare but 'user' er moddhe '_id' aste pare ta bola hoi ni... so again 'Interface' ke change korte hobe...
            if (token) {
                session.user._id = token._id  
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username  
            }
          return session  
        }
    },


    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    }, 
    secret: process.env.NEXTAUTH_SECRET              // ai somosto kaj ai 'secret' key er upor dependent...
}



/*  📌📌📌📌📌

Let's break down the authOptions configuration for NextAuth, a popular authentication library for Next.js. This configuration manages how authentication is handled, including providers, callbacks, and session handling.

Explanation:
    (1️⃣)authOptions (Type: NextAuthOptions):
        This is the main configuration object for NextAuth.

    (2️⃣)providers:
        CredentialsProvider:
            🟢 This allows custom username/password login (non-OAuth).
            🟢 id & name: Unique identifiers for the provider.
            🟢 credentials: Defines the fields required for the login form (email and password).
            🟢 authorize function:
                ➡️ Custom logic for authenticating users.
                ➡️ Connects to the database (dbConnect).
                ➡️ Searches for the user by email or username.
                ➡️ Checks if the account is verified and the password is correct.
                ➡️ If successful, returns the user; otherwise, throws errors.
    (3️⃣) callbacks:
        Functions to control the behavior of NextAuth.

        🟢 jwt:
            ➡️ Runs when a token is created or updated.
            ➡️ Adds custom fields (_id, isVerified, isAcceptingMessages, username) to the token.
            ➡️ These fields are not part of the default NextAuth user, so you need to define them explicitly in TypeScript.
        🟢 session:
            ➡️ Called whenever a session is checked.
            ➡️ Adds custom fields from the token to the session (_id, isVerified, isAcceptingMessages, username).
            ➡️ This allows you to access more user-specific data in the session without additional database queries.
    (4️⃣) pages:
         ➡️ signIn: Specifies the custom sign-in page (/sign-in).
    (5️⃣) session:
         ➡️ strategy: "jwt": Uses JSON Web Tokens (JWT) for sessions instead of database sessions. This makes the app stateless.
    (7️⃣) secret:
         ➡️ A secret key for encrypting JWT. This should be a secure value (e.g., from process.env.NEXTAUTH_SECRET).

*/