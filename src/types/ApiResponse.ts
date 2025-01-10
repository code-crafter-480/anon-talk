// Ekhane actual response hobe na, akhane shudu hobe ki type a amar response show korbe...

import { Message } from "@/model/User"

export interface ApiResponse {
    success: boolean;
    message: string;
    isAccesptingMessages?: boolean ;
    messages?: Array<Message>

}