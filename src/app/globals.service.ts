import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  readonly cookieKey = 'ProjectGroupA';
  username: string = "";
  calendarid: number = 0;
  constructor() { }
}
