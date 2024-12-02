import { Component, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputComponent } from '../forms/text-input/text-input.component';
import { DatePickedComponent } from "../forms/date-picked/date-picked.component";
import { Router } from '@angular/router';
import { NavbarComponent } from '../../Shared/navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgIf, TextInputComponent, DatePickedComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cancelRegister = output<boolean>(); 
  private toastr = inject(ToastrService);
  @ViewChild('NavbarComponent') navbar!: NavbarComponent;
  registerForm : FormGroup = new FormGroup({});
  model : any = {};
  maxDate = new Date();
  validationErrors : string[] | undefined

  ngOnInit(){
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18)
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender:['male'],
      username:['',Validators.required],
      knownAs : ['',Validators.required],
      dateOfBirth : ['',Validators.required],
      city : ['',Validators.required],
      country : ['',Validators.required],
      password : ['',[Validators.required, Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword : ['', [Validators.required, this.matchValues('password')]]
    })
    this.registerForm.controls['password'].valueChanges.subscribe({
      next :()=> this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo : string): ValidatorFn{
    return (control : AbstractControl) =>{
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching : true}
    }
  }


  register(){
    this.accountService.register(this.registerForm.value).subscribe({
      next : response => {
        if(response.token === 1)
          this.router.navigateByUrl('/members')
      },
      error : error => this.validationErrors = error
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
