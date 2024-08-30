import { Component, OnDestroy } from '@angular/core';
import { CarrierInputContainerComponent } from "./carrier/shipment-header-carrier";
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { ShipmentHeaderRefnumComponent } from './refnum/shipment-header-refnum';

@Component({
    selector: 'shipment-header-input',
    templateUrl: 'shipment-header-input.html',
    styleUrl: 'shipment-header-input.scss',
    standalone: true,
    imports: [
        ShipmentHeaderRefnumComponent,
        CarrierInputContainerComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatFormField,
        MatLabel,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ShipmentHeaderInputComponent
        }
    ]
})

export class ShipmentHeaderInputComponent implements ControlValueAccessor, OnDestroy {

    shipmentHeaderForm: FormGroup = this.formBuilder.group({
        shipmentDomainName: [''],
        shipmentXid: [''],
        travelStatus: [''],
        emissionStatus: [''],
        shipmentTaker: [''],
        shipmentCarrier: [''],
        shipmentRefnums: ['']
    });

    constructor(private formBuilder: FormBuilder) { }

    onTouched: Function = () => { };

    onChangeSubs: Subscription[] = [];

    ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    registerOnChange(onChange: any): void {
        const sub = this.shipmentHeaderForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.shipmentHeaderForm.disable();
        else
            this.shipmentHeaderForm.enable();
    }

    writeValue(value: any): void {
        if (value)
            this.shipmentHeaderForm.setValue(value, { emitEvent: false });
    }

}