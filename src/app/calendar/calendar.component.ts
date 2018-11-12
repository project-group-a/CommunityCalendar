import { Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GlobalsService } from '../globals.service';
import {DatabaseConnectionService, UserTableData} from '../database-connection.service';
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
import { Subject } from 'rxjs';





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
  constructor(
    public datePicker: MatDatepickerModule,
    private service: DatabaseConnectionService,
    public dialog: MatDialog,
    public router: Router,
    private cookieService: CookieService,
    private globalsService: GlobalsService
  ) { }
  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'Test event 1',
      color: this.colors.red,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      title: 'Test event 2',
      color: this.colors.yellow
    }
  ];
  ngOnInit() {}

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
export class AddEventComponent extends CalendarComponent {
  addEvent(addEventForm: NgForm) {
    const eventName = addEventForm.value.eventName;
    const startDate = addEventForm.value.startDate;
    const endDate = addEventForm.value.endDate;
  }
}
