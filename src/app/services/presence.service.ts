import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../Models/user';


@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  hubConnection?: HubConnection;
  private toastr = inject(ToastrService);
  onlineUsers = signal<string[]>([]);

  async createHubConnection(user: User){
     this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence',{
        accessTokenFactory:()=> user.securityToken
      })
      .withAutomaticReconnect()
      .build();

      await this.hubConnection.start().then(success => console.log('connected with id = ',this.hubConnection?.connectionId)).catch(error => console.log(error));

      this.hubConnection.on('UserIsOnline',username =>{
        this.toastr.info(username + ' has connected');
      });

      this.hubConnection.on('UserIsOffline',username =>{
        this.toastr.warning(username + ' has disconnected');
      });

      this.hubConnection.on('GetOnlineUsers',username =>{
        this.onlineUsers.set(username);
      });

      this.hubConnection.onclose(error =>{
        if(error){
          console.error("Connection closed unexpectedly",error);
          this.toastr.error('Connection lost. Reconnecting......');

          this.hubConnection?.start()
            .then(() => this.toastr.success('Reconnected Successfully!'))
            .catch(() => console.error('Reconnection Failed:',error))
        }else{
          console.log('Connection Closed gracefully.');
        }
      });
  }

  stopHubConnection(){
    if(this.hubConnection?.state === HubConnectionState.Connected){
       this.hubConnection.stop().catch(error => console.log(error)); 
    }
  }
}
