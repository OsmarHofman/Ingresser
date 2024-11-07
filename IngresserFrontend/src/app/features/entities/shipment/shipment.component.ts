import { Component, Injectable, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ShipmentHeaderAccordionComponent } from './shipment-header/shipment-header-accordion.component';
import { ShipmentHeader2AccordionComponent } from './shipment-header2/shipment-header2-accordion.component';
import { ShipmentStopAccordionComponent } from './shipment-stop/shipment-stop-accordion.component';
import { LocationAccordionComponent } from './location/location-accordion.component';
import { ReleaseAccordionComponent } from './release/release-accordion.component';
import { Subscription } from 'rxjs';
import { Shipment, ShipmentHeader } from '../../../model/shipment';
import { AppService } from '../../service/app.service';

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
    },
    AppService,
  ],
})


@Injectable()
export class ShipmentComponent implements ControlValueAccessor, OnDestroy {

  constructor(private formBuilder: FormBuilder, private appService: AppService) { }

  //#region Form

  public form: FormGroup = this.formBuilder.group({
    shipments: this.formBuilder.array([]),
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

  get shipments() {
    return this.form.get('shipments') as FormArray;
  }

  //#endregion

  //#region Validation

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

  public removeShipmentByIndex(index: number): void {
    this.shipments.removeAt(index);
  }

  public duplicateShipmentByIndex(index: number): void {
    const shipmentToBeDuplicated = this.shipments.controls[index].value;

    //TODO: Ajustar para não usar referencia de memória
    this.shipments.push(
      this.formBuilder.group(this.appService.getNewShipmentByExistent(shipmentToBeDuplicated))
    )
  }

  public getShipmentXidByIndex(index: number): string {
    const shipment: any = this.form.controls['shipments'].value[index].shipmentHeader.tab;

    let shipmentXid = '';

    if (shipment) {

      if (shipment.tabSelected === 0) {
        shipmentXid = shipment.inputContent.shipmentXid;
      } else {
        shipmentXid = ShipmentHeader.getShipmentXidFromXml(shipment.xmlContent);
      }
    }

    return shipmentXid;
  }

  public getShipmentTravelStatusByIndex(index: number): string {
    const shipment: any = this.form.controls['shipments'].value[index].shipmentHeader.tab;

    let travelStatus = '';

    if (shipment) {

      if (shipment.tabSelected === 0) {
        travelStatus = shipment.inputContent.travelStatus;
      } else {
        travelStatus = ShipmentHeader.getTravelStatusFromXml(shipment.xmlContent);
      }
    }

    return travelStatus;
  }
}