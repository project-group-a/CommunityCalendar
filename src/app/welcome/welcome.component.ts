import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import {DatabaseConnectionService, TableData} from '../database-connection.service';

/* tslint:disable no-shadowed-variable */
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  tableData: TableData = {actor_id: -1, first_name: '', last_name: '', last_update: ''};
  constructor(private router: Router, private service: DatabaseConnectionService) { }

  ngOnInit() {
    this.service.getTableData().subscribe((data: TableData) => {
      this.tableData = data;
    }, (error) => {
      console.error('error getting data');
      console.error(error);
    });
  }

  logIn(f: NgForm) {
    console.log('logIn form value:');
    console.log(f.value);
    // TODO: if username/password works, send to calendar page; else show error message
    this.service.signIn(f.value.username, f.value.password).subscribe((data: any) => {
      if (data.length > 0) {
        localStorage.setItem('projectgroupa_currentUser', data[0].username);
        this.router.navigate(['calendar']);
      } else {
        console.error('Username/password not in database');
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
      // TODO: show error alert/message
      console.log('A value is null');
    }

    if (pass === pass2 && this.emailIsValid(email) && username.length > 0) {
      this.service.addUser(username, email, pass).subscribe((data: any) => {
        console.log('add user successful:');
        console.log(data);
        signUpForm.reset();
        this.router.navigate(['signedUp']);
      }, (err: any) => {
        console.error('add user failed: ');
        console.error(err);
        console.error(`Reason: ${err.error.sqlMessage}`);
      });
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
