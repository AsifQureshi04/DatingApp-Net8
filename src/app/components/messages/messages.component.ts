import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../CustomPipe/filter.pipe';
import { CommonModule, NgFor } from '@angular/common';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { TimeagoModule } from 'ngx-timeago';
import { AccountService } from '../../services/account.service';
import { MessageService } from '../../services/message.service';
import { AllUserChatHistory, Messages, UserChatHistoryDetail } from '../../Models/UserChatDetails';
import { DateTimeFormatterPipe } from '../../CustomPipe/date-time-formatter.pipe';
import { ToastrService } from 'ngx-toastr';
import { PresenceService } from '../../services/presence.service';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule,FilterPipe, NgFor,CommonModule, TimeagoModule,DateTimeFormatterPipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements AfterViewInit {

  private accountService = inject(AccountService);
  messageService = inject(MessageService);
  private toastr = inject(ToastrService)
  presenceService = inject(PresenceService)
  @ViewChild('scrollMe') scrollContainer?: any;
  AllUsersChats: AllUserChatHistory[]=[];
  UserChatHistoryDetail!:UserChatHistoryDetail;
  AllUserChatHistory!:AllUserChatHistory;
  userid : number = 0
  messages!: Messages[]
  url :any
  searchText = '';
  activeChatId: string | null = null;
  activeChat : any
  senderId : number = 0;
  recipientId : number = 0;
  newMessage = '';
  currentUserId = 1;
  @ViewChild('memberCard') memberCard!: MemberCardComponent;
  member : any;  
  response : any;
  selectedUserChatId : string | undefined;
  lastActive:any
  user : any;
  chatPartnerName:any
  activeMenuMessageId: number | null = null;

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString!);
    this.userid = user.data.id
    this.messageService.creatHubConnection(user,this.userid)

    setTimeout(()=>{
      if(this.messageService.hubConnection?.state === HubConnectionState.Connected)
          console.log('connection established')
          this.sendMsgList();
    },1000);
    
    if(!this.messageService.AllUsersChats())
      this.GetAllUsersChats()
    
    this.member = history.state.member;
    if(this.member){
      const selectedUserChat : any = [...this.messageService.AllUsersChats()!].filter(x => x.recipientId === this.member.id && x.senderId === this.userid)
      console.log(selectedUserChat[0])
      if(selectedUserChat.length > 0){
        this.selectChat(selectedUserChat[0])
      }
      else{
          this.lastActive=this.member.lastActive ,
          this.chatPartnerName=this.member.userName
          this.url = this.member.photoUrl
          console.log(this.lastActive,this.chatPartnerName)
      }
    }
  }

  public selectChat(chat:any) {
    console.log('chat',chat)
    this.lastActive = chat.lastActive
    this.chatPartnerName = chat.chatPartnerName
    this.url = chat.photoUrl
    this.senderId = chat.senderId;
    this.recipientId = this.userid === chat.senderId ? chat.recipientId : chat.senderId;
    this.activeChatId = chat.chatId;
  
    const payload = {
      pageNumber: 0,
      pageSize: 1000,
      senderId: chat.senderId,
      recipientId: chat.recipientId,
      chatId: chat.chatId,
    };

    this.messageService.GetAllUserChatHistory1(payload).subscribe({
      next: (chatMap) => {
        for (const [key, value] of chatMap.entries()) {
          this.messages = value;
          this.UserChatHistoryDetail = key;
          this.lastActive = this.UserChatHistoryDetail.lastActive
        }
      },
      error: (err) => {
        console.error("Error:", err);
      },
    });
    this.scrollToBottom(); 

  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(){
    if(this.scrollContainer){
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
  
  sendMsgList(){
    console.log('ReceiveMessage event is registered')
    this.messageService.hubConnection?.on('ReceiveMessage', (senderId : number,response: any) => {
      // if((response.data[0].senderId === this.senderId &&
      //     response.data[0].recipientId === this.recipientId) || 
      //     (response.data[0].recipientId === this.senderId &&
      //     response.data[0].senderId === this.recipientId)
      //   ){
        console.log("sjdhfksjdk")
        this.activeChatId = response.data[0].chatId  
        this.setNewMessage(response)
      //  }
    });    
  }

  sendMessage(): void {
    if(!this.messages && this.member){
       this.recipientId = this.member.id
       this.messages = [];
      }
      const payload = {
        "chatId": this.activeChatId ? this.activeChatId : "",
        "senderId": this.userid,
        "recipientId": this.recipientId,
        "message": this.newMessage
      }
      this.messageService.sendMessage_V1(payload)
  }

  setNewMessage(response:any){
    this.response = response
    console.log('response',this.response)
    if(this.response.token === 1){
      this.messages.push({
        "id":this.response.data[0].id,
        "message": this.response.data[0].message,
        "createdOn": this.response.data[0].createdOn,
        "photoUrl":'',
        "senderId": this.userid === this.response.data[0].senderId ? this.response.data[0].senderId : this.recipientId,
        "recipientId": this.userid === this.response.data[0].recipientId ? this.response.data[0].recipientId : this.senderId,
        "chatId":this.response.data[0].chatId
      });
      const user = [...this.messageService.AllUsersChats()!]
      .filter(item => item.chatId === this.activeChatId)
      if(!user.length){
        const currentChats = this.messageService.AllUsersChats() ?? [];
          this.messageService.AllUsersChats!.set([
          {
            "id":this.response.data[0].id,
            "senderId": this.userid,
            "recipientId": this.recipientId,
            "chatId": this.response.data[0].chatId,
            "message": this.response.data[0].message,
            "photoUrl": this.response.data[0].photoUrl,
            "chatPartnerName": this.response.data[0].chatPartnerName,
            "createdOn": this.response.data[0].createdOn.toString()
          },
          ...currentChats
        ]);
        }else{
          const idx = this.messageService.AllUsersChats()?.findIndex(m => m.chatId === this.response.data[0].chatId)
          const allChats = [...this.messageService.AllUsersChats()!];
          const [ele] = allChats.splice(idx!, 1); 
          ele.message = this.response.data[0].message;
          ele.createdOn = this.response.data[0].createdOn
          allChats.unshift(ele);
          this.messageService.AllUsersChats.set(allChats);
        }

        const chatMap = new Map<UserChatHistoryDetail, Messages[]>();
        const userChatHisotry = {
            "lastActive":this.lastActive,
            "knownAs":this.chatPartnerName
        }
        chatMap.set(userChatHisotry, this.messages);
        this.messageService.chatCache.set(this.response.data[0].chatId, chatMap);
    }
    this.newMessage = ''; 
  }

  GetAllUsersChats(){
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user = JSON.parse(userString);
    const payload = 
      {
        "pageNumber": 0,
        "pageSize": 0,
        "userId": user.data.id
      }
    this.messageService.GetAllUserChatMaster(payload)
  }

  toggleMenu(messageId : number){
    this.activeMenuMessageId = this.activeMenuMessageId === messageId ? null : messageId;
  }

  editMessage(message : Messages){}

  deleteMessage(message : Messages){
    console.log('delete working',message.id)
    this.messageService.deleteMessage(message.id!).subscribe({
      next : (response) => {
          if(response.token === 1){
            const index = this.messages.findIndex(m => m.id === message.id)
            const length = this.messages.length;
            this.messages.splice(index,1);
            if(index === length-1){
              const lastMessage = this.messages[this.messages.length-1];
              const updatedChats = this.messageService.AllUsersChats()!.map(chat =>
                chat.id === message.id
                  ? { ...chat, message: lastMessage.message, 
                               id: lastMessage.id, 
                               createdOn: lastMessage.createdOn,                                
                    }
                  : chat
              );
          
              this.messageService.AllUsersChats.set(updatedChats);
            }
            this.toastr.success('Message deleted successfully!','',{
              timeOut:5000,  
              closeButton: true, 
              positionClass: 'toast-bottom-right' 
            });
          }
      }
    })
  }
}
