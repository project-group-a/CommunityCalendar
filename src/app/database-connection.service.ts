import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

export interface UserTableData {
  Calendar_Id: number;
  Is_Admin: number;
  User_Email: string;
  User_Name: string;
  User_Pass: string;
}

export interface EventTableData {
  Event_Id: string;
  Event_Name: string;
  Event_Date: string;
  Event_Type: string;
  Is_Approved: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseConnectionService {
  private readonly dataUrl = '/api/data';
  private readonly addUserUrl = '/api/addUser';
  private readonly signInUrl = '/api/signIn';
  private readonly getEventsUrl = '/api/getEvents';
  private readonly addEventUrl = '/api/addEvent';
  private readonly editEventUrl = '/api/editEvent';
  private readonly deleteEventUrl = '/api/deleteEvent';
  constructor(private http: HttpClient) {}

  getTableData() {
    return this.http.get<any>(this.dataUrl);
  }

  signIn(username: string, password: string) {
    const requestBody = {
      username,
      pass: password
    };
    return this.http.post<UserTableData[]>(this.signInUrl, requestBody, httpOptions);
  }

  addUser(username: string, email: string, password: string) {
    const requestBody = {
      username,
      email,
      pass: password
    };
    return this.http.post(this.addUserUrl, requestBody, httpOptions);
  }

  getEvents() {
    return this.http.get<EventTableData[]>(this.getEventsUrl);
  }

  addEvent(name: string, date: string, type: string) {
    // date should be in the format 'YYYY-MM-DD HH:MM:SS'
    const requestBody = {
      name,
      date,
      type
    };
    return this.http.post(this.addEventUrl, requestBody, httpOptions);
  }

  editEvent(eventId: string, eventName: string, eventDate: string, eventType: string) {
    const requestBody = {
      eventId,
      eventName,
      eventDate,
      eventType
    };
    return this.http.post(this.editEventUrl, requestBody, httpOptions);
  }

  deleteEvent(eventId: string) {
    const requestBody = {
      id: eventId
    };
    return this.http.post(this.deleteEventUrl, requestBody, httpOptions);
  }
}
