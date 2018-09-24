import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userLoggedIn = false;
  constructor() {}

  changeOfRoutes() {
    if (localStorage.getItem('projectgroupa_currentUser')) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
  }
}
