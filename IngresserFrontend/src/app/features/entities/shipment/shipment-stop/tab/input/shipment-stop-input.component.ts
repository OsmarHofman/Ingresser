import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
    ControlValueAccessor,
    FormArray,
    FormControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    FormsModule,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';

import { Subscription } from 'rxjs';

@Component({
    selector: 'shipment-stop-input',
    templateUrl: 'shipment-stop-input.component.html',
    styleUrl: 'shipment-stop-input.component.scss',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatFormField,
        MatLabel,
        MatSelectModule,
        MatCheckbox
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ShipmentStopInputComponent
        }
    ]
})

export class ShipmentStopInputComponent implements ControlValueAccessor, OnDestroy {

    public stopTypes = ['Coleta', 'Entrega'];

    constructor(private formBuilder: FormBuilder) {
        this.addRow();
        this.addRow();
    }

    //#region Form

    public shipmentStopForm: FormGroup = this.formBuilder.group({
        stops: this.formBuilder.array([]),
    });

    get shipmentStops() {
        return this.shipmentStopForm.get('stops') as FormArray;
    }

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.shipmentStopForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.shipmentStopForm.disable();
        else
            this.shipmentStopForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.shipmentStopForm.setValue(value, { emitEvent: false });
    }

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    //#endregion

    
    //#region Table

    public selectedRows: number[] = [];

    public addRow() {
        const defaultStopType: string = this.shipmentStops.controls.length % 2 == 0 ? 'Coleta' : 'Entrega';

        this.shipmentStops.push(

            this.formBuilder.group({
                stopSequence: new FormControl(this.shipmentStops.controls.length + 1),
                locationDomainName: new FormControl(),
                locationXid: new FormControl(),
                stopType: new FormControl(defaultStopType),
            })
        );
    }

    public removeRow() {
        this.selectedRows.sort((a, b) => b - a)
            .forEach(rowIndex => {
                this.shipmentStops.removeAt(rowIndex);
            });

        this.selectedRows = [];
    }

    public markRowAsSelected(selectedIndex: number) {
        if (this.selectedRows.includes(selectedIndex))
            delete this.selectedRows[this.selectedRows.indexOf(selectedIndex)];
        else
            this.selectedRows.push(selectedIndex);
    }

    //#endregion

}