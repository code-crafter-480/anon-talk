// Ekhane actual response hobe na, akhane shudu hobe ki type a amar response show korbe...

import { Message } from "@/model/User"

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean ;               // sign-up er somoy ami chaibo na ai gulo pathate...
    messages?: Array<Message>;

}