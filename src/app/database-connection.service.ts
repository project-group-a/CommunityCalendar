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
  private readonly getUsersUrl = '/api/getUsers';
  private readonly signInUrl = '/api/signIn';
  private readonly getEventsUrl = '/api/getEvents?search={query}';
  private readonly getCalendarUrl = '/api/getCalendar?Calendar_Id={Calendar_Id}';
  private readonly addEventUrl = '/api/addEvent';
  private readonly editEventUrl = '/api/editEvent';
  private readonly deleteEventUrl = '/api/deleteEvent';
  private readonly subscribeToEventUrl = '/api/subscribeToEvent';
  private readonly getNotificationUrl = '/api/getNotification?Calendar_Id={Calendar_Id}';
  private readonly unsubscribeFromEventUrl = '/api/unsubscribeFromEvent';
  private readonly inviteUserUrl = '/api/inviteUser';
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

  getUsers() {
    return this.http.get<UserTableData[]>(this.getUsersUrl);
  }

  getEvents(query: string) {
    return this.http.get<EventTableData[]>(this.getEventsUrl.replace('{query}', query));
  }

  getCalendar(calendarid: string) {
    return this.http.get<EventTableData[]>(this.getCalendarUrl.replace('{Calendar_Id}', calendarid));
  }

  addEvent(eventName: string, eventDescription: string, startDate:
    string, endDate: string, type: string, isApproved: string, owner: string) {
    // date should be in the format 'YYYY-MM-DD HH:MM:SS'
    const requestBody = {
      eventName,
      eventDescription,
      startDate,
      endDate,
      type,
      isApproved,
      owner
    };

    console.log('hit add event in connection service; requestbody:');
    console.log(requestBody);
    return this.http.post(this.addEventUrl, requestBody, httpOptions);
  }

  editEvent(eventId: string, eventName: string, eventDescription: string, eventStart: string, eventEnd: string) {
    const requestBody = {
      eventId,
      eventName,
      eventDescription,
      eventStart,
      eventEnd
    };
    return this.http.post(this.editEventUrl, requestBody, httpOptions);
  }

  deleteEvent(eventId: string) {
    const requestBody = {
      id: eventId
    };
    return this.http.post(this.deleteEventUrl, requestBody, httpOptions);
  }

  subscribeToEvent(calendarId: string, eventId: string) {
    const requestBody = {
      calendarid: calendarId,
      eventid: eventId
    };
    return this.http.post(this.subscribeToEventUrl, requestBody, httpOptions);
  }

  getNotification(calendarid: string) {
    return this.http.get<EventTableData[]>(this.getNotificationUrl.replace('{Calendar_Id}', calendarid));
  }

  unsubscribeFromEvent(calendarId: string, eventId: string) {
    const requestBody = {
      calendarid: calendarId,
      eventid: eventId
    };
    return this.http.post(this.unsubscribeFromEventUrl, requestBody, httpOptions);
  }

  inviteUser(user: string, eventId: string) {
    const requestBody = {
      user: user,
      eventid: eventId
    };
    return this.http.post(this.inviteUserUrl, requestBody, httpOptions);
  }
}
