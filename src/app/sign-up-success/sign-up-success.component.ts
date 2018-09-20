import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-success',
  templateUrl: './sign-up-success.component.html',
  styleUrls: ['./sign-up-success.component.css']
})
export class SignUpSuccessComponent implements OnInit {
  timeleft = 10;
  constructor(private router: Router) {}

  ngOnInit() {
    // setTimeout(function() {
    //   this.toHomeScreen();
    // }, 1000);
  }

  toHomeScreen(): void {
    this.router.navigate(['welcome']);
  }
}
