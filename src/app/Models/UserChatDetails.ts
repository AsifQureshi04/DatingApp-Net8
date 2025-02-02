export interface UserChatHistoryDetail {
    knownAs: string
    lastActive: string  
  }
  
  export interface Messages {
    id? : number;
    message: string
    photoUrl?: string
    createdOn: string
    senderId? : number
    recipientId? : number
    chatId : string
  }

  export interface AllUserChatHistory {
    id?:number;
    senderId?: number;
    recipientId?: number
    chatId?: string
    message: string
    photoUrl?: string
    recipientName?: string
    createdOn: string
    chatPartnerName?:string
  }