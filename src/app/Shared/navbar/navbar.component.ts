import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, BsDropdownModule,RouterLink,RouterLinkActive,],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: any = {}
  username : any;

  ngOnInit(){
    this.username = localStorage.getItem('username');
  }

    login() {
      this.accountService.login(this.model).subscribe({
        next : response =>{
          localStorage.setItem('username',this.model.Username)
          this.username = this.model.Username;
          this.toastr.success(this.username);
        },
        error : error =>{
          this.toastr.error(error.error);
        }
      })
    }

    logout(){
      this.accountService.logout();
      localStorage.removeItem('username');
      this.router.navigateByUrl('/');
    }
}
