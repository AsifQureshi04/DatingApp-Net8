import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../Models/member';
import { of, tap } from 'rxjs';
import { response } from '../Models/response';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService)
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);
  member = signal<Member[]>([]);
  response = signal<response | null>(null);


  getMembers(){
    const payload = {
      "userName": "",
      "token": ""
    }
    return this.http.post<any>(this.baseUrl+'Users/GetAllUsers',payload).subscribe({
      next : (response) => {
        this.members.set(response.data)
      }
    })
  }

  getMember(username : string){
    const payload = {
      "userName": username,
      "token": ""
    }
    const member = this.members().find(x => x.userName === username)
    if(member != undefined) return of(member)
    return this.http.post<any>(this.baseUrl+'Users/GetAllUsers' ,payload)
  }

  updateMember(member : Member){
    member.userName = this.accountService.currentUser()?.userName as string
   return this.http.put(this.baseUrl+'Users/UpdateUser',member).pipe(
      tap(()=>{
        this.members.update(members => members.map(m => m.userName === member.userName ? member : m));
      })
    );
  }

}
