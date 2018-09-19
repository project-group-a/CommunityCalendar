import { Component } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
// import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialog} from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
/* export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
} */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-project';
  username = 'shadowkiler343';
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  // matcher = new MyErrorStateMatcher();
  constructor(public dialog: MatDialog) {}

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
    // if all values are valid, reset form
  }
}

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: 'dialog-content.html',
})
export class DialogContentComponent {}
