import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./Shared/navbar/navbar.component";
import { AccountService } from './services/account.service';
import { HomeComponent } from './components/home/home.component';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,HomeComponent,NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);
  title = 'DatingApp';
  
  ngOnInit(): void {  
    this.setCurrentUser();
  }

  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }

 

}


