import mongoose, {Schema, Document} from "mongoose";


export interface Message extends Document{
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true, 
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[] 
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"], 
        unique: true,
        match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }, 
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    }, 
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expiry is required"]
    }, 
    isVerified: {
        type: Boolean,
        default: false
    }, 
    isAcceptingMessages: {
        type: Boolean,
        default: true
    }, 
    messages: [MessageSchema]
})
 
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)     // In last '<User>' this is for typesafety...

export default UserModel

/*
🔖 This line of code is setting up a Mongoose model for a 'User' collection, but it does so in a way that checks if the model already exists before creating it. Here's a simple breakdown:
    ➡️ 'mongoose.models.User':  This checks if a 'User' model is already defined in Mongoose's internal models cache. If it exists, it will be used.
    ➡️ 'as mongoose.Model<User>':  This part is a TypeScript type assertion, ensuring that 'mongoose.models.User' is treated as a Mongoose model of type 'User'.
    ➡️ '||':  This is a logical OR operator. If 'mongoose.models.User' is 'undefined' (i.e., the model hasn't been defined yet), the code will proceed to the right side.
    ➡️ 'mongoose.model<User>("User", UserSchema)':  This creates a new 'User' model using the 'UserSchema' if it doesn't already exist.
*/