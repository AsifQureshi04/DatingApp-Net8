import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, model, OnInit, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../Models/member';
import { of, tap } from 'rxjs';
import { response } from '../Models/response';
import { AccountService } from './account.service';
import { DeletePhotoPayload } from '../Models/DeletePhotoPayload';
import { PaginatedResult } from '../Models/pagination';
import { UserParams } from '../Models/userParams';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService)
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCache = new Map();
  user = this.accountService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user))

  resetUserParams(){
    this.userParams.set(new UserParams(this.user))
  }

  getMembers(){
    const response = this.memberCache.get(Object.values(this.userParams()).join('-'));
    if(response) return setPaginatedResponse(response,this.paginatedResult);

    let params = setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);
    params = params.append('minAge',this.userParams().minAge)
    params = params.append('maxAge',this.userParams().maxAge)
    params = params.append('gender',this.userParams().gender)
    params = params.append('orderBy',this.userParams().orderBy)
    return this.http.get<any>(this.baseUrl+'Users/GetAllUsers',{observe:'response',params}).subscribe({
      next : (response) => {
          setPaginatedResponse(response,this.paginatedResult)
          this.memberCache.set(Object.values(this.userParams()).join('-'),response)
      }
    })
    
  }



  getMember(Username : string){
    const member = [...this.memberCache.values()]
        .reduce((arr,elem) => arr.concat(elem.body.data),[])
        .find((m : Member) => m.userName === Username);

    if(member) return of(member);

    let params = new HttpParams();
    if(Username){
      params = params.append("Username",Username);
    }
    return this.http.get<any>(this.baseUrl+'Users/GetAllUsers',{observe:'response',params})
  }

  updateMember(member : Member){
    member.userName = this.accountService.currentUser()?.data.userName as string
   return this.http.put(this.baseUrl+'Users/UpdateUser',member).pipe(
      // tap(()=>{
      //   this.members.update(members => members.map(m => m.userName === member.userName ? member : m));
      // })
    );
  }

  setMainPhoto(photo:any, username:string){
    const payload = {...photo }
    payload.username = username
    return this.http.post(this.baseUrl+'Users/SetMainPhoto',payload).pipe(
      // tap(()=>{
      //   this.members.update(members =>members.map(m=>{
      //     if(members.includes(photo)){
      //       m.photoUrl = photo.url    
      //     }
      //     return m;
      //   }))
      // })
    );
  }

  deletePhoto(deletePhotoPayload : DeletePhotoPayload){
    return this.http.post(this.baseUrl+'Users/DeletePhoto',deletePhotoPayload);
  }
}
