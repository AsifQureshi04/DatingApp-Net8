import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../Models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private likeService = inject(LikesService);
  private presenceService  = inject(PresenceService);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);


  login(model : any){
    return this.http.post<User>(this.baseUrl + 'account/login',model).pipe(
      map(user =>{
        if(user){
          if(user.token == 1){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUser.set(user);
          this.presenceService.createHubConnection(user);
        }else{
              
        }
        }
        return user;
      })
    )
  }

  register(model : any){
    return this.http.post<User>(this.baseUrl + 'Account/register',model).pipe(
      map(user =>{
        if(user.token === 1){
          this.setCurrentUser(user)
        }
        return user;
      })
    )
  }

  setCurrentUser(user : User){
    console.log('connected/disconnected in presence service')
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUser.set(user);
    this.likeService.getLikeIds();
    this.presenceService.createHubConnection(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }
}
