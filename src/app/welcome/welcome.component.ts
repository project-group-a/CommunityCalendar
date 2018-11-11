import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import {DatabaseConnectionService, UserTableData} from '../database-connection.service';
import { MatSnackBar } from '@angular/material';

// https://www.npmjs.com/package/ngx-cookie-service
import { CookieService } from 'ngx-cookie-service';
import { GlobalsService } from '../globals.service';

/* tslint:disable no-shadowed-variable */
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  tableData: any;
  constructor(
    private router: Router,
    private service: DatabaseConnectionService,
    private snackBar: MatSnackBar,
    private cookieService: CookieService,
    private globalsService: GlobalsService
  ) { }

  ngOnInit() {
    this.service.getTableData().subscribe((data: any) => {
      this.tableData = data;
      console.log('user table data:');
      console.log(data);
    }, (error) => {
      console.error('error getting data');
      console.error(error);
    });
  }

  logIn(f: NgForm) {
    console.log('logIn form value:');
    console.log(f.value);
    this.service.signIn(f.value.username, f.value.password).subscribe((data: UserTableData[]) => {
      if (data.length > 0) {
        this.cookieService.set(this.globalsService.cookieKey, data[0].User_Name, 3);
        this.globalsService.username = data[0].User_Name;
        this.globalsService.calendarid = data[0].Calendar_Id;
        this.router.navigate(['calendar']);
      } else {
        console.error('Username/password not in database');
        this.snackBar.open(`Invalid username/password`, '', {
          duration: 3000
        });
      }
    }, (err: any) => {
      console.error('sign in error:');
      console.error(err);
    });
    f.reset();
  }

  signUp(signUpForm: NgForm) {
    const email = signUpForm.value.email;
    const username = signUpForm.value.username;
    const pass = signUpForm.value.password;
    const pass2 = signUpForm.value.password2;

    if (email === null || username === null || pass === null || pass2 === null) {
      this.snackBar.open('Incomplete form entry', '', {
        duration: 3000
      });
      console.log('A value is null');
    }

    const passwordsValid: boolean = pass === pass2;
    const emailValid: boolean = this.emailIsValid(email);
    const usernameValid: boolean = username.length > 0;
    if (passwordsValid && emailValid && usernameValid) {
      this.service.addUser(username, email, pass).subscribe((data: any) => {
        console.log('add user successful:');
        console.log(data);
        signUpForm.reset();
        this.router.navigate(['signedUp']);
      }, (err: any) => {
        console.error('add user failed: ');
        console.error(err);
        console.error(`Reason: ${err.error.sqlMessage}`);
        if (err.error.sqlMessage.includes('Duplicate entry')) {
          this.snackBar.open('Username already taken', '', {
            duration: 3000
          });
          const usernameTextBox = document.getElementById('signUpUsername');
          if (usernameTextBox !== null) {
            usernameTextBox.focus();
          }
        }
      });
    } else {
      let message = '';
      if (!passwordsValid) {
        message = 'Passwords don\'t match';
      } else if (!emailValid) {
        message = 'Email needs to be of the form <email>@<site>';
      } else if (!usernameValid) {
        message = 'Username field needs to be filled out';
      }
      this.snackBar.open(message, '', {
        duration: 3000
      });
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
