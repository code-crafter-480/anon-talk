// 📌 You can use '.d.ts' files to add custom types or extend the types of existing modules, such as when using libraries like 'next-auth'.
// ekhane defined module ke redefined/modify korte parbo... ata akta special declare file...


import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean ;
        isAcceptingMessages?: boolean ;
        username?: string
    }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean ;
            isAcceptingMessages?: boolean ;
            username?: string
        } & DefaultSession['user']     // ➡️ Basically i mean that, jokhoni akta default session hobe tar moddhe akta 'user' key thakbei thakbe, and ai 'user' key er moddhe value asbe na asbe-na seta porer kotha, But amar akta 'key' to dorkar porbei noito query enquery korar somoy direct error throw kore debe... and same things 'JWT' er jonno korte hobe...
    }
}

declare module 'next-auth/jwt' {         // uporer method ke amra aivabeo likhte pari...
    interface JWT {
        _id?: string;
        isVerified?: boolean ;
        isAcceptingMessages?: boolean ;
        username?: string
    }
}