import { Component, OnInit } from '@angular/core';
import { MatFormFieldControl, ErrorStateMatcher } from '@angular/material';
import * as $ from 'jquery';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [{ provide: MatFormFieldControl, useExisting: LoginComponent }]
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);



  private isChangingForms: boolean;

  constructor() { }

  ngOnInit() {
  
  }

  private initJquery() {
  }

  login() {
    console.log('Login')
  }

  register() {
    console.log('Register')
  }

}
