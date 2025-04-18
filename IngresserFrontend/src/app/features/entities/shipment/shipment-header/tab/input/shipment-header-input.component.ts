import { Component, OnDestroy } from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Subscription } from 'rxjs';

import { CarrierInputContainerComponent } from "./carrier/shipment-header-carrier.component";
import { CostInputComponent } from '../../../../../../components/cost-input/cost-input.component';
import { RefnumComponent } from '../../../../../../components/refnum/refnum.component';

@Component({
    selector: 'shipment-header-input',
    templateUrl: 'shipment-header-input.component.html',
    styleUrl: 'shipment-header-input.component.scss',
    standalone: true,
    imports: [
        CarrierInputContainerComponent,
        RefnumComponent,
        CostInputComponent,
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

    constructor(private formBuilder: FormBuilder) { }

    //#region Form

    public shipmentHeaderForm: FormGroup = this.formBuilder.group({
        shipmentDomainName: [''],
        shipmentXid: [''],
        travelStatus: [''],
        emissionStatus: [''],
        shipmentTaker: [''],
        shipmentCarrier: [''],
        shipmentRefnums: [''],
        shipmentCost: ['']
    });

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.shipmentHeaderForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.shipmentHeaderForm.disable();
        else
            this.shipmentHeaderForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.shipmentHeaderForm.setValue(value, { emitEvent: false });
    }

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    //#endregion
}