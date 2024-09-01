import { Component, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';

@Component({
    selector: 'shipment-header-carrier',
    templateUrl: 'shipment-header-carrier.component.html',
    styleUrl: 'shipment-header-carrier.component.scss',
    standalone: true,
    imports: [
        MatCardModule,
        MatFormField,
        MatLabel,
        MatInputModule,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: CarrierInputContainerComponent
        }
    ]
})

export class CarrierInputContainerComponent implements ControlValueAccessor, OnDestroy {

    constructor(private formBuilder: FormBuilder) { }

    //#region Form
    
    public carrierInputForm: FormGroup = this.formBuilder.group({
        domainName: [''],
        xid: ['']
    });

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.carrierInputForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.carrierInputForm.disable();
        else
            this.carrierInputForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.carrierInputForm.setValue(value, { emitEvent: false });
    }

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    //#endregion
}