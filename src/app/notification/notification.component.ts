import { Component, OnInit } from '@angular/core';
import {DatabaseConnectionService} from '../database-connection.service';
import { CookieService } from 'ngx-cookie-service';
import { GlobalsService } from '../globals.service';
import { MatSnackBar } from '@angular/material';
import {
    CalendarEvent
  } from 'angular-calendar';
@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
  })

  export class NotificationComponent implements OnInit {
    events: CalendarEvent[] = [];
    query = '';
    constructor(private snackBar: MatSnackBar,
                private service: DatabaseConnectionService,
                private cookieService: CookieService,
                private globalsService: GlobalsService) { }
    ngOnInit() {
        this.filter();
    }

    public filter() {
      this.events = [];
      this.service.getNotification(this.cookieService.get('calendarid')).subscribe((data: any) => {
        for (const row of data) {
            this.events.push({
              start: new Date(row['Event_Date_Start']),
              end: new Date(row['Event_Date_End']),
              title: row['Event_Name'],
              meta: {
                id: row['Event_Id'],
                description: row['Event_Description'],
                owner: row['Event_Owner']
              }
            });
        }
      });
    }

    public subscribe(id: number) {
      this.service.subscribeToEvent(this.cookieService.get('calendarid'), id.toString()).subscribe((data: any) => {
        this.snackBar.open(`Event added to calendar`, '', {
          duration: 3000
        });
      });
    }
  }
