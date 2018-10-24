import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GlobalsService } from './globals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userLoggedIn = false;
  constructor(private cookieService: CookieService, private globalsService: GlobalsService) {}

  changeOfRoutes() {
    if (this.cookieService.check(this.globalsService.cookieKey)) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
  }
}
