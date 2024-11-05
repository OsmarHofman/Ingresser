import { ApplicationConfig, NgModule } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { ShipmentComponent } from './features/segments/shipment/shipment.component';
import { NFeComponent } from "./features/segments/nfe/nfe.component";
import { NFeParticipantAccordionComponent } from "./features/segments/nfe/participant/nfe-participant-accordion.component";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient()
  ],
};

@NgModule({
  imports: [
    BrowserModule,
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    ShipmentComponent,
    MatSidenavModule,
    BrowserAnimationsModule,
    NFeComponent,
    NFeParticipantAccordionComponent
],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [provideHttpClient()]
})
export class AppModule { }
