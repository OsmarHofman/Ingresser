import { CommonModule } from '@angular/common';
import { ApplicationConfig, NgModule } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { ShipmentComponent } from './features/entities/shipment/shipment.component';
import { NFeComponent } from "./features/entities/nfe/nfe.component";
import { NFeParticipantAccordionComponent } from "./features/entities/nfe/participant/nfe-participant-accordion.component";

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
    NFeParticipantAccordionComponent,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [provideHttpClient()]
})
export class AppModule { }
