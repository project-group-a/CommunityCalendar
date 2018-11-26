import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  readonly cookieKey = 'ProjectGroupA';
  userId = '';
  constructor() { }
  setId(id: string) {
    this.userId = id;
  }
}
