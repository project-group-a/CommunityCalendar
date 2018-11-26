import { Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import { MatDialog, MatSnackBar, MatNativeDateModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GlobalsService } from '../globals.service';
import {DatabaseConnectionService, UserTableData} from '../database-connection.service';
import { Subject } from 'rxjs';
import { NgForm, FormControl, FormGroup } from '@angular/forms';
import {
  CalendarEvent,
  CalendarView
} from 'angular-calendar';

/* tslint:disable max-line-length */
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
            description: row['Event_Description'],
            owner: row['Event_Owner'],
            type: row['Event_Type'],
            is_approved: row['Is_Approved']
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

  eventClicked({event}: {event: CalendarEvent}): void {
    const dialogRef = this.dialog.open(ViewEventComponent);
    dialogRef.componentInstance.eventId = event.meta.id;
    dialogRef.componentInstance.title = event.title;
    dialogRef.componentInstance.startDate = event.start;
    dialogRef.componentInstance.endDate = event.end != null ? event.end : new Date();
    dialogRef.componentInstance.description = event.meta.description;
    dialogRef.componentInstance.owner = event.meta.owner;
    dialogRef.componentInstance.type = event.meta.type;
    dialogRef.componentInstance.isEventOwner = (event.meta.owner === this.cookieService.get(this.globalsService.cookieKey));
    dialogRef.componentInstance.setValues();

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
  private readonly type = 'Private';
  private readonly isApproved = '1';
  private readonly owner = this.cookieService.get(this.globalsService.cookieKey);

  constructor(
    private service: DatabaseConnectionService,
    public dialog: MatDialog,
    public router: Router,
    private cookieService: CookieService,
    private globalsService: GlobalsService
  ) { }
  addEvent(addEventForm: NgForm) {
    console.log(`hit addEvent method; event name: '${addEventForm.value.eventName}', description: '${addEventForm.value.eventDescription}'`);
    const eventName = addEventForm.value.eventName;
    const eventDescription = addEventForm.value.eventDescription;
    const startDate = `${addEventForm.value.startDate.toISOString()}`.split('T')[0];
    const endDate = `${addEventForm.value.endDate.toISOString()}`.split('T')[0];

    this.service.addEvent(eventName, eventDescription, startDate, endDate, this.type, this.isApproved, this.owner).subscribe((data: any) => {
        // TODO: add success or error message based on response from server
        console.log('add event data:');
        console.log(data);
        if (data.affectedRows > 0) {
          console.log('success!');
        }
      }, (err: any) => {
        console.error('error adding event:');
        console.error(err);
      });
  }
}

@Component({
  selector: 'app-view-event',
  templateUrl: '../viewEventMenu.html',
})
export class ViewEventComponent {
  form: FormGroup = new FormGroup({});
  editMode = false;
  eventId = '';
  title = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  description = '';
  owner = '';
  type = '';
  isEventOwner = false;

  constructor(
    private snackBar: MatSnackBar,
    private service: DatabaseConnectionService,
    public dialog: MatDialog,
    public router: Router,
    private cookieService: CookieService
  ) {}

  setValues() {
    this.form = new FormGroup({
      eventName : new FormControl({value: this.title, disabled: true}),
      startDate : new FormControl({value: this.startDate, disabled: true}),
      endDate: new FormControl({value: this.endDate, disabled: true})
    });
  }

  editEvent() {
    this.editMode = true;
    this.form.setValue({
      eventName : this.title,
      startDate : this.startDate,
      endDate: this.endDate
    });
    this.form.enable();
  }

  viewEvent() {
    this.editMode = false;
    this.form.setValue({
      eventName : this.title,
      startDate : this.startDate,
      endDate: this.endDate
    });
    this.form.disable();
  }

  deleteEvent() {
    this.service.deleteEvent(this.eventId).subscribe((data: any) => {
      this.snackBar.open(`Event deleted from app`, '', {
        duration: 3000
      });
    });
  }

  submitEdits(editEventForm: NgForm) {
    this.service.editEvent(this.eventId, editEventForm.value.eventName,
      editEventForm.value.startDate.toISOString().slice(0, 19).replace('T', ' '),
      editEventForm.value.endDate.toISOString().slice(0, 19).replace('T', ' ')).subscribe((data: any) => {
      this.snackBar.open(`Event edits saved`, '', {
        duration: 3000
      });
    });
  }

  unsubscribe() {
    this.service.unsubscribeFromEvent(this.cookieService.get('calendarid'), this.eventId).subscribe((data: any) => {
      this.snackBar.open(`Event removed from calendar`, '', {
        duration: 3000
      });
    });
  }
}
