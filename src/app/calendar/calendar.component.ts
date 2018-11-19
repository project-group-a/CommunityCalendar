import { Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GlobalsService } from '../globals.service';
import {DatabaseConnectionService, UserTableData} from '../database-connection.service';
import { Subject } from 'rxjs';
import {NgForm} from '@angular/forms';

import {
  CalendarEvent,
  CalendarView
} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';





@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  refresh: Subject<any> = new Subject();
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(public datePicker: MatDatepickerModule,
    public dialog: MatDialog,
    public router: Router,
    private cookieService: CookieService,
    private service: DatabaseConnectionService,
    private globalsService: GlobalsService) { }
  ngOnInit() {
    this.service.getCalendar(this.cookieService.get('calendarid')).subscribe((data: any) => {
      for (const row of data) {
        this.events.push({
          start: new Date(row['Event_Date_Start']),
          end: new Date(row['Event_Date_End']),
          title: row['Event_Name'],
          meta: {
            id: row['Event_Id'],
            description: row['Event_Description']
          }
        });
      }
      this.refresh.next();
      console.log('event table data:');
      console.log(data);
    }, (error) => {
      console.error('error getting data');
      console.error(error);
    });
  }

  openEventAdd(): void {
    const dialogRef = this.dialog.open(AddEventComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public onViewChange(val: CalendarView) {
    this.view = val;
  }




}

@Component({
  selector: 'app-add-event',
  templateUrl: '../addEventMenu.html',
})

export class AddEventComponent {
  eventName: Text = new Text();
  startDate: Date = new Date();
  endDate: Date = new Date();
  type: String = 'type';

  constructor(
    private service: DatabaseConnectionService,
    public dialog: MatDialog,
    public router: Router,
    private globalsService: GlobalsService
  ) { }
  addEvent(addEventForm: NgForm) {
    console.log('hit addEvent component');
    this.eventName = addEventForm.value.eventName;
    this.startDate = addEventForm.value.startDate;
    this.endDate = addEventForm.value.endDate;

    this.service.addEvent(addEventForm.value.eventName, addEventForm.value.StartDate.String, this.type.toString());
  }
}
