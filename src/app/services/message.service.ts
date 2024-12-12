import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable, single, tap } from 'rxjs';
import { PaginatedResult } from '../Models/pagination';
import { AllUserChatHistory, Messages, UserChatHistoryDetail } from '../Models/UserChatDetails';
import { response } from '../Models/response';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl
  private http = inject(HttpClient);
   // AllUsersChats: [] = [];
  AllUsersChats = signal<AllUserChatHistory[] | null>(null);
  chatCache = new Map<string, Map<UserChatHistoryDetail,Messages[]>>();

  //paginatedResult = signal<PaginatedResult<AllUserChatHistory[]> | null>(null);


  GetAllUserChatMaster(payload: any){
    this.http.post<any>(`${this.baseUrl}Messages/GetAllUserChats`,payload).subscribe({
      next : (response) =>{
        this.AllUsersChats.set(response.data);
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
  
}
