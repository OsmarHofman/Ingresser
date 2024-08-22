import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import {Accordion} from '../app/components/accordion/accordion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CdkAccordionModule, Accordion],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'Ingresser';
}
