import { Component, Injectable, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ShipmentHeaderAccordionComponent } from './shipment-header/shipment-header-accordion.component';
import { ShipmentHeader2AccordionComponent } from './shipment-header2/shipment-header2-accordion.component';
import { ShipmentStopAccordionComponent } from './shipment-stop/shipment-stop-accordion.component';
import { LocationAccordionComponent } from './location/location-accordion.component';
import { ReleaseAccordionComponent } from './release/release-accordion.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shipment',
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.scss',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    ShipmentHeaderAccordionComponent,
    ShipmentHeader2AccordionComponent,
    ShipmentStopAccordionComponent,
    LocationAccordionComponent,
    ReleaseAccordionComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ShipmentComponent
    }
  ],
})


@Injectable()
export class ShipmentComponent implements ControlValueAccessor, OnDestroy {

  constructor(private formBuilder: FormBuilder) { }

  //#region Form

  public form: FormGroup = this.formBuilder.group({
    shipmentHeader: '',
    shipmentHeader2: [''],
    shipmentStop: [''],
    location: [''],
    release: [''],
  });

  public onTouched: Function = () => { };

  public onChangeSubs: Subscription[] = [];

  public registerOnChange(onChange: any): void {
    const sub = this.form.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }

  public registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled)
      this.form.disable();
    else
      this.form.enable();
  }

  public writeValue(value: any): void {
    if (value)
      this.form.setValue(value, { emitEvent: false });
  }

  public ngOnDestroy(): void {
    this.onChangeSubs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  //#endregion

  private validateForm(): boolean {

    if (!this.validateFormControls()) return false;

    return true;
  }

  private validateFormControls(): boolean {

    /*O Cost não é validado aqui, pois se ele for preenchido manualmente será usado 
      tanto no embarque quanto na release. Mas caso use o xml no shipmentHeader e na
      release, terá que colocar em cada um. Então depois tem que ser validado se o cost
      foi preenchido manualmente ou se está no xml do embarque ou da release
    */
    const controlNames = ['shipmentHeader', 'shipmentHeader2', 'shipmentStop', 'location', 'release'];

    return controlNames.every(controlName => this.form.controls[controlName].value);
  }


  //#endregion

  showShipmentAccordion: boolean = false;

  public createShipment() {
    this.showShipmentAccordion = true;
  }

  public deleteShipment() {
    if (confirm('Tem certeza que deseja remover esse embarque?')) {
      this.showShipmentAccordion = false;
    }
  }
}