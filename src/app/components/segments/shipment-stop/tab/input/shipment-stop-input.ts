import { Component, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';


@Component({
    selector: 'shipment-stop-input',
    templateUrl: 'shipment-stop-input.html',
    styleUrl: 'shipment-stop-input.scss',
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

    shipmentStopForm: FormGroup = this.formBuilder.group('');

    stopTypes = ['Coleta', 'Entrega'];

    constructor(private formBuilder: FormBuilder) { }

    //#region Grid

    selectedRows: number[] = [];

    get shipmentStops() {
        return this.shipmentStopForm.get('stops') as FormArray;
    }

    ngOnInit() {
        this.shipmentStopForm = this.formBuilder.group({
            stops: this.formBuilder.array([]),
        });
    }

    addRow() {
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

    removeRow() {
        this.selectedRows.sort((a, b) => b - a)
            .forEach(rowIndex => {
                this.shipmentStops.removeAt(rowIndex);
            });

        this.selectedRows = [];
    }

    markRowAsSelected(selectedIndex: number) {
        if (this.selectedRows.includes(selectedIndex))
            delete this.selectedRows[this.selectedRows.indexOf(selectedIndex)];
        else
            this.selectedRows.push(selectedIndex);
    }

    //#endregion

    //#region Parent form control

    onTouched: Function = () => { };

    onChangeSubs: Subscription[] = [];

    ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    registerOnChange(onChange: any): void {
        const sub = this.shipmentStopForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.shipmentStopForm.disable();
        else
            this.shipmentStopForm.enable();
    }

    writeValue(value: any): void {
        if (value)
            this.shipmentStopForm.setValue(value, { emitEvent: false });
    }

    //#endregion
}