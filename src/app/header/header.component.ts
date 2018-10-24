import { Component, OnInit, Input } from '@angular/core';
import {MatDialog} from '@angular/material';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GlobalsService } from '../globals.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() userLoggedIn = false;
  constructor(
    public dialog: MatDialog,
    public router: Router,
    private cookieService: CookieService,
    private globalsService: GlobalsService
  ) { }

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  logout() {
    this.cookieService.delete(this.globalsService.cookieKey);
    this.userLoggedIn = false;
    this.router.navigate(['welcome']);
  }

}

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: '../dialog-content.html',
})
export class DialogContentComponent {}
