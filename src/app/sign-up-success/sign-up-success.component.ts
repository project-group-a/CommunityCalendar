import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-success',
  templateUrl: './sign-up-success.component.html',
  styleUrls: ['./sign-up-success.component.css']
})
export class SignUpSuccessComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  toHomeScreen(): void {
    this.router.navigate(['welcome']);
  }
}
