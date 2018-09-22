import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import {DatabaseConnectionService} from '../database-connection.service';

/* tslint:disable no-shadowed-variable */
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router, private service: DatabaseConnectionService) { }

  ngOnInit() {
    this.service.getTableData().subscribe((data: any) => {
      console.log(data);
    }, (error) => {
      console.error('error getting data');
      console.error(error);
    });
  }

  logIn(f: NgForm) {
    console.log('logIn form value:');
    console.log(f.value);
    // TODO: if username/password works, send to calendar page
    if (f.value.username === 'username' && f.value.password === 'password') {
      this.router.navigate(['calendar']);
    } else {
      // TODO: if it doesn't, show error alert/message/modal
      console.log('Cannot authenticate.');
    }
    f.reset();
  }

  signUp(signUpForm: NgForm) {
    const email = signUpForm.value.email;
    const username = signUpForm.value.username;
    const pass = signUpForm.value.password;
    const pass2 = signUpForm.value.password2;

    if (email === null || username === null || pass === null || pass2 === null) {
      // TODO: show error alert/message
      console.log('A value is null');
    }

    if (pass === pass2 && this.emailIsValid(email) && username.length > 0) {
      // TODO: if signed up, send to successful sign-up page; after ~10 seconds send back to home page
      signUpForm.reset();
      this.router.navigate(['signedUp']);
    } else {
      // TODO: show error alert/message
    }
  }

  private emailIsValid(email: string): boolean {
    if (email.indexOf('@') > -1) {
      const temp: string[] = email.split('@');
      if (temp.length === 2 && temp[0].length > 0 && temp[1].length > 0) {
        return true;
      }
    }
    return false;
  }
}
