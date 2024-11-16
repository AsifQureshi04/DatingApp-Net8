import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../Models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getMembers(){
    const payload = {
      "userName": "",
      "token": ""
    }
    return this.http.post<any>(this.baseUrl+'Users/GetAllUsers',payload)
  }

  getMember(username : string){
    const payload = {
      "userName": username,
      "token": ""
    }
    return this.http.post<Member>(this.baseUrl+'Users/GetAllUsers' ,payload)
  }
}
