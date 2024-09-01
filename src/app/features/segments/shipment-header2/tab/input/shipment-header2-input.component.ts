import { Component, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';


@Component({
    selector: 'shipment-header2-input',
    templateUrl: 'shipment-header2-input.component.html',
    styleUrl: 'shipment-header2-input.component.scss',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormField,
        MatLabel,
        MatSelectModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ShipmentHeader2InputComponent
        }
    ]
})

export class ShipmentHeader2InputComponent implements ControlValueAccessor, OnDestroy {

    public perspectives = ['Buy', 'Sell'];

    constructor(private formBuilder: FormBuilder) { }

    //#region Form

    public shipmentHeader2Form: FormGroup = this.formBuilder.group({
        perspective: [''],
    });

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    public registerOnChange(onChange: any): void {
        const sub = this.shipmentHeader2Form.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.shipmentHeader2Form.disable();
        else
            this.shipmentHeader2Form.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.shipmentHeader2Form.setValue(value, { emitEvent: false });
    }

    //#endregion
}