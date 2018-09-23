import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

export interface TableData {
  actor_id: number;
  first_name: string;
  last_name: string;
  last_update: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseConnectionService {
  private readonly dataUrl = '/api/data';
  private readonly addUserUrl = '/api/addUser';
  constructor(private http: HttpClient) {}

  getTableData() {
    return this.http.get<TableData>(this.dataUrl);
  }

  addUser(username: string, email: string, password: string) {
    const requestBody = {
      username,
      email,
      pass: password
    };
    return this.http.post(this.addUserUrl, requestBody, httpOptions);
  }
}
