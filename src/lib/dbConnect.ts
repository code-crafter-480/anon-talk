import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number         //➡️ '?' ai symbol er mane ho66e ata optional, ata hoteo pare na hoteo pare ar jodi hoi tahole ata number hobe...
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {        //➡️ db kichu return korbe, so ata akta Promise return korbe, and ai promise er inside er ki value a6e ta niye amar kono headache nei so 'void' likhbo...  
    if (connection.isConnected) {
        console.log("Already Connected to database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})         // Connection er sathe amra aro option send korte pari ai object a...
        // console.log("db connection: ", db.connections)
        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected Successfully")
    } catch (error) {
        console.log("Database connection failed", error)

        process.exit(1)
    }
}       

export default dbConnect 