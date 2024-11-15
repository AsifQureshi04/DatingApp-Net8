import { Component, inject } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  http = inject(HttpClient)
  registerMode = false;
  users : any;

  ngOnInit(){
    this.getUsers();
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  cancelRegsiter(event : any){
    this.registerMode = event.value;
  }

  getUsers(){
    this.http.get('https://localhost:7228/api/Users/GetAllUsers').subscribe({
      next : (response) => {this.users = response},
      error : (error) => {console.log(error)},
      complete :() => {console.log('Request has completed');     console.log(this.users);
      }
    })
  }
}
