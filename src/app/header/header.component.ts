import { Component, OnInit, Input } from '@angular/core';
import {MatDialog} from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() userLoggedIn = false;
  constructor(public dialog: MatDialog, public router: Router) { }

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  logout() {
    // TODO: show logged out success message
    localStorage.removeItem('projectgroupa_currentUser');
    this.userLoggedIn = false;
    this.router.navigate(['welcome']);
  }

}

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: '../dialog-content.html',
})
export class DialogContentComponent {}
