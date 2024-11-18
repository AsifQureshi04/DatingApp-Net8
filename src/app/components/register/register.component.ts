import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>(); 
  private toastr = inject(ToastrService);

  model : any = {};


  register(){
    this.accountService.register(this.model).subscribe({
      next : response =>{
        this.cancel();
      },
      error : error => this.toastr.error(error.error)
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
