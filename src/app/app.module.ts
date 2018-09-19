import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';

import { AppComponent, DialogContentComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule
  ],
  entryComponents: [AppComponent, DialogContentComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
