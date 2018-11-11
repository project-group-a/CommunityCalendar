import { Component, OnInit } from '@angular/core';
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
import {DatabaseConnectionService} from '../database-connection.service';
import { GlobalsService } from '../globals.service';

@Component({
  selector: 'app-calendar',
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
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(private service: DatabaseConnectionService,
    private globalsService: GlobalsService) { }
  ngOnInit() {
    this.service.getCalendar(this.globalsService.calendarid).subscribe((data: any) => {
      for(var row of data){
        this.events.push({
          start: new Date(row["Event_Date_Start"]),
          end: new Date(row["Event_Date_End"]),
          title: row["Event_Name"],
          meta: {
            id: row["Event_Id"],
            description: row["Event_Description"]
          }
        })
      }
      console.log('event table data:');
      console.log(data);
    }, (error) => {
      console.error('error getting data');
      console.error(error);
    });
  }

  public onViewChange(val: CalendarView) {
    this.view = val;
  }
}
