import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../CustomPipe/filter.pipe';
import { CommonModule, NgFor } from '@angular/common';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { Member } from '../../Models/member';
import { TimeagoModule } from 'ngx-timeago';
import { AccountService } from '../../services/account.service';
import { MessageService } from '../../services/message.service';
import { concatAll } from 'rxjs';
import { AllUserChatHistory, Messages, UserChatHistoryDetail } from '../../Models/UserChatDetails';
import { DateTimeFormatterPipe } from '../../CustomPipe/date-time-formatter.pipe';
import { TabHeadingDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule,FilterPipe, NgFor,CommonModule, TimeagoModule,DateTimeFormatterPipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  private accountService = inject(AccountService);
  messageService = inject(MessageService);
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
  selectedUserChatId : string | undefined;
  lastActive:any
  chatPartnerName:any

  ngOnInit(): void {
    this.member = history.state.member;
    if(!this.messageService.AllUsersChats())
      this.GetAllUsersChats()
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString!);
    this.userid = user.data.id
    if(this.member){
      const selectedUserChat : any = [...this.messageService.AllUsersChats()!].filter(x => x.recipientId === this.member.id && x.senderId === user.data.id)
      console.log(selectedUserChat[0])
      if(selectedUserChat.length > 0)
        this.selectChat(selectedUserChat[0])
      else{
            this.lastActive=this.member.lastActive ,
            this.chatPartnerName=this.member.userName
            this.url = this.member.photoUrl
            console.log(this.lastActive,this.chatPartnerName)
      }
    }
  }

  public selectChat(chat:any) {
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
        }
      },
      error: (err) => {
        console.error("Error:", err);
      },
    });
  }
  

  sendMessage(): void {
    console.log(this.newMessage.trim(),this.userid,this.recipientId);
    console.log(this.messages)
    if(!this.messages && this.member){
       this.recipientId = this.member.id
       this.messages = [];
    }
    if (this.newMessage.trim()) {
      this.messages.push({
        "message": this.newMessage,
        "createdOn": new Date().toISOString(),
        "photoUrl":'',
        "senderId": this.userid,
        "recipientId": this.recipientId
      });
      const payload = {
        "chatId": this.activeChatId ? this.activeChatId : "",
        "senderId": this.userid,
        "recipientId": this.recipientId,
        "message": this.newMessage
      }
      this.messageService.sendMessage(payload).subscribe({
        next:(response)=>{
            if(response.token === 1){
              const user = [...this.messageService.AllUsersChats()!]
              .filter(item => item.senderId === this.userid && item.recipientId === this.recipientId)
              console.log('new chat user ',user);
              if(!user.length){
                const currentChats = this.messageService.AllUsersChats() ?? [];
                  this.messageService.AllUsersChats!.set([
                    {
                    senderId: this.userid,
                    "recipientId": this.recipientId,
                    "chatId": response.data[0].chatId,
                    "message": response.data[0].message,
                    "photoUrl": response.data[0].photoUrl,
                    "chatPartnerName": response.data[0].chatPartnerName,
                    "createdOn": response.data[0].createdOn.toString()
                  },
                  ...currentChats
                ]);
                }
                if(!this.messageService.AllUsersChats())
                  this.GetAllUsersChats()
                console.log([...this.messageService.AllUsersChats()!])
            }                                          
        },
        error : (error) =>{

        }
      })
      this.newMessage = '';
    }
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
}
