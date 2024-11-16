import { Component } from '@angular/core';
import { RegisterComponent } from "../register/register.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  registerMode = false;

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  cancelRegsiter(event : any){
    this.registerMode = event.value;
  }


}
