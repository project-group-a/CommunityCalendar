import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  username = 'shadowkiler343';
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  logIn(f: NgForm) {
    console.log(f.value);
    f.reset();
  }

  signUp(signUpForm: NgForm) {
    console.log(signUpForm.value);
    // TODO: if all values are valid, reset form
  }
}

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: '../dialog-content.html',
})
export class DialogContentComponent {}
