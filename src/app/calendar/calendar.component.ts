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

    dialogRef.componentInstance.endDate = new Date();
    dialogRef.componentInstance.endTime = '';
    if (event.end != null) {
      dialogRef.componentInstance.endDate = new Date((event.end.getMonth() + 1) + '/' + event.end.getDate() + '/' + event.end.getFullYear());
      dialogRef.componentInstance.endTime = event.end.toString().split(' ')[4].substring(0, 5);
    }

    dialogRef.componentInstance.eventId = event.meta.id;
    dialogRef.componentInstance.title = event.title;
    dialogRef.componentInstance.startDate = new Date((event.start.getMonth() + 1) + '/' + event.start.getDate() + '/' + event.start.getFullYear());
    dialogRef.componentInstance.startTime = event.start.toString().split(' ')[4].substring(0, 5);
    dialogRef.componentInstance.description = event.meta.description;
    dialogRef.componentInstance.owner = event.meta.owner;
    dialogRef.componentInstance.type = event.meta.type;
    dialogRef.componentInstance.isEventOwner = (event.meta.owner === this.cookieService.get(this.globalsService.cookieKey));
    dialogRef.componentInstance.setValues();

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.refresh.next();
    });
  }
  openEventAdd(): void {
    const dialogRef = this.dialog.open(AddEventComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.refresh.next();
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
  type = 'Public';
  isApproved = '1';
  owner = this.cookieService.get(this.globalsService.cookieKey);
  startDate: Date = new Date;
  startTime: String = '';
  endDate: Date = new Date();
  endTime: String = '';

  constructor(
    private snackBar: MatSnackBar,
    private service: DatabaseConnectionService,
    public dialog: MatDialog,
    public router: Router,
    private cookieService: CookieService,
    private globalsService: GlobalsService
  ) { }
  addEvent(addEventForm: NgForm) {
    this.startDate = addEventForm.value.startDate.toISOString().slice(0, 10);
    this.startTime = addEventForm.value.startTime.toString();
    this.endDate = addEventForm.value.endDate.toISOString().slice(0, 10);
    this.endTime = addEventForm.value.endTime.toString();

    const startDateTime = this.startDate.toString() + ' ' + this.startTime.toString() + ':00';
    const endDateTime = this.endDate.toString() + ' ' + this.endTime.toString() + ':00';

    console.log(this.startDate);
    console.log(this.endDate);

    console.log('hit addEvent method');
    console.log(this.owner);
    this.service.addEvent(addEventForm.value.eventName, addEventForm.value.eventDescription,
      startDateTime, endDateTime, this.type, this.isApproved, this.owner).subscribe((data: any) => {
        this.snackBar.open(`Event added`, '', {
          duration: 3000
        });
    });

  }
}

@Component({
  selector: 'app-view-event',
  templateUrl: '../viewEventMenu.html',
})
export class ViewEventComponent {
  form: FormGroup = new FormGroup({});
  editMode: Boolean = false;
  eventId: String = '';
  title: String = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  startTime = '';
  endTime = '';
  description: String = '';
  owner: String = '';
  type: String = '';
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
      endDate: new FormControl({value: this.endDate, disabled: true}),
      eventDescription: new FormControl({value: this.description, disabled: true}),
      startTime : new FormControl({value: this.startTime, disabled: true}),
      endTime : new FormControl({value: this.endTime, disabled: true})
    });
  }

  editEvent() {
    this.editMode = true;
    this.form.setValue({
      eventName : this.title,
      startDate : this.startDate,
      endDate: this.endDate,
      eventDescription: this.description,
      startTime: this.startTime,
      endTime: this.endTime
    });
    this.form.enable();
  }

  viewEvent() {
    this.editMode = false;
    this.form.setValue({
      eventName : this.title,
      startDate : this.startDate,
      endDate: this.endDate,
      eventDescription: this.description
    });
    this.form.disable();
  }

  deleteEvent() {
    this.service.deleteEvent(this.eventId.toString()).subscribe((data: any) => {
      this.snackBar.open(`Event deleted from app`, '', {
        duration: 3000
      });
    });
  }

  submitEdits(editEventForm: NgForm) {
    const startDate = editEventForm.value.startDate.toISOString().slice(0, 10);
    const startTime = editEventForm.value.startTime;
    const endDate = editEventForm.value.endDate.toISOString().slice(0, 10);
    const endTime = editEventForm.value.endTime;

    const startDateTime = startDate + ' ' + startTime + ':00';
    const endDateTime = endDate + ' ' + endTime + ':00';
    this.service.editEvent(this.eventId.toString(), editEventForm.value.eventName, editEventForm.value.eventDescription,
      startDateTime, endDateTime).subscribe((data: any) => {
        this.snackBar.open(`Event edits saved`, '', {
          duration: 3000
        });
    });
  }

  unsubscribe() {
    this.service.unsubscribeFromEvent(this.cookieService.get('calendarid'), this.eventId.toString()).subscribe((data: any) => {
      this.snackBar.open(`Event removed from calendar`, '', {
        duration: 3000
      });
    });
  }

  openInviteUsers(): void {
    const dialogRef = this.dialog.open(InviteUsersComponent);
    dialogRef.componentInstance.eventId = this.eventId;
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'app-invite-users',
  templateUrl: '../inviteUsers.html',
})
export class InviteUsersComponent implements OnInit {
  eventId: String = '';
  users = new FormControl();
  userList: string[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private service: DatabaseConnectionService,
    public dialog: MatDialog,
    public router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.service.getUsers().subscribe((data: any) => {
      for (const row of data) {
        this.userList.push(row['User_Name']);
      }
    });
  }

  invite() {
    for (const user of this.users.value) {
      this.service.inviteUser(user, this.eventId.toString()).subscribe((data: any) => {
        this.snackBar.open(`Successfully invited ${user}`, '', {
          duration: 3000
        });
      });
    }
  }
}
