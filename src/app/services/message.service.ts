import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable, single, tap } from 'rxjs';
import { PaginatedResult } from '../Models/pagination';
import { AllUserChatHistory, Messages, UserChatHistoryDetail } from '../Models/UserChatDetails';
import { response } from '../Models/response';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../Models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl
  hubUrl = environment.hubsUrl;
  private http = inject(HttpClient);
  private presenceService = inject(PresenceService);
  hubConnection? : HubConnection
   // AllUsersChats: [] = [];
  newMessage : any
  AllUsersChats = signal<AllUserChatHistory[] | null>(null);
  chatCache = new Map<string, Map<UserChatHistoryDetail,Messages[]>>();

  //paginatedResult = signal<PaginatedResult<AllUserChatHistory[]> | null>(null);

  async creatHubConnection(user : User, UserId:number){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?UserId=' + UserId,{
        accessTokenFactory:() => user.securityToken
      })
      .withAutomaticReconnect()
      .build();

      await this.hubConnection.start().then(() => console.log('connected with ',UserId)).catch(error => console.error(error))

  }

  stopHubConnection(){
    if(this.hubConnection?.state === HubConnectionState.Connected){
      this.hubConnection.stop().then(()=> console.log('disconnected')).catch(error => console.error(error));
    }
  }

  GetAllUserChatMaster(payload: any){
    this.http.post<any>(`${this.baseUrl}Messages/GetAllUserChats`,payload).subscribe({
      next : (response) =>{
        this.AllUsersChats.set(response.data);
        console.log('all chats',this.AllUsersChats())
      }
    })
    return this.AllUsersChats();
  }

  GetAllUserChatHistory(payload: any) {
   var chats;
   if (this.chatCache.has(payload.chatId)) {
    console.log(this.chatCache.get(payload.chatId))
      return this.chatCache.get(payload.chatId)
    }
  
    this.http.post<any>(`${this.baseUrl}Messages/GetUserChatHistory`, payload).subscribe({
      next : (response)=>{
        this.chatCache.set(payload.chatId,new Map().set(response.data,response.data1))
        console.log(this.chatCache.get(payload.chatId))
      }
    });
    setTimeout(()=>{
      console.log(this.chatCache.get(payload.chatId))
    chats = this.chatCache.get(payload.chatId);
    },1500);
    return chats;
  }

  GetAllUserChatHistory1(payload: any): Observable<Map<UserChatHistoryDetail, Messages[]>> {
    if (this.chatCache.has(payload.chatId)) {
      console.log(this.chatCache.get(payload.chatId));
      return new Observable(observer => {
        observer.next(this.chatCache.get(payload.chatId)!);
        observer.complete();
      });
    }
  
    return new Observable(observer => {
      this.http.post<any>(`${this.baseUrl}Messages/GetUserChatHistory`, payload).subscribe({
        next: (response) => {
          const chatMap = new Map<UserChatHistoryDetail, Messages[]>();
          chatMap.set(response.data, response.data1);
          this.chatCache.set(payload.chatId, chatMap);
  
          console.log(this.chatCache.get(payload.chatId));
          observer.next(chatMap);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }

  sendMessage(payload:any){
   return this.http.post<any>(`${this.baseUrl}Messages/SendMessage`,payload);
  }

  sendMessage_V1(payload:any){
      console.log(payload);
      if (this.hubConnection?.state === HubConnectionState.Connected) {
        this.hubConnection.invoke('SendMessage',this.hubConnection.connectionId,payload)
          .catch(error => console.error('Error sending message:', error));
      } else {
        console.error('Hub connection is not established. Please reconnect.');
      }
   }

  //  onReceiveMessage(callback: (message: any) => void): void{
  //   this.hubConnection?.on('ReceiveMessage', (message: any) => {
  //     console.log('New message received:', message);
  //     this.newMessage = message;
  //   });
  //  }

  deleteMessage(id : number){
    return this.http.post<any>(`${this.baseUrl}Messages/DeleteMessage?id=${id}`,{})
  }
  
}
