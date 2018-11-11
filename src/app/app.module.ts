import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {
  MatButtonModule, 
  MatCheckboxModule, 
  MatButtonToggleModule,
  MatIconModule
} from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatSnackBarModule} from '@angular/material/snack-bar';


import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import {DialogContentComponent} from './header/header.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ListComponent } from './list/list.component'
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SignUpSuccessComponent } from './sign-up-success/sign-up-success.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DialogContentComponent,
    CalendarComponent,
    ListComponent,
    WelcomeComponent,
    HeaderComponent,
    FooterComponent,
    SignUpSuccessComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
    MatGridListModule,
    MatDividerModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
  entryComponents: [AppComponent, DialogContentComponent],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
