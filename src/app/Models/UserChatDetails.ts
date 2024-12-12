export interface UserChatHistoryDetail {
    knownAs: string
    lastActive: string
  }
  
  export interface Messages {
    message: string
    photoUrl: string
    createdOn: string
    senderId? : number
    recipientId? : number
  }

  export interface AllUserChatHistory {
    senderId: number;
    recipientId: number
    chatId: string
    message: string
    photoUrl: string
    recipientName?: string
    createdOn: string
    chatPartnerName?:string
  }