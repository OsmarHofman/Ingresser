import { Component, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';

@Component({
    selector: 'shipment-header-carrier',
    templateUrl: 'shipment-header-carrier.html',
    styleUrl: 'shipment-header-carrier.scss',
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

    carrierInputForm: FormGroup = this.formBuilder.group({
        domainName: [''],
        xid: ['']
    });

    onTouched: Function = () => { };

    onChangeSubs: Subscription[] = [];


    constructor(private formBuilder: FormBuilder) { }


    ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    registerOnChange(onChange: any): void {
        const sub = this.carrierInputForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.carrierInputForm.disable();
        else
            this.carrierInputForm.enable();
    }

    writeValue(value: any): void {
        if (value)
            this.carrierInputForm.setValue(value, { emitEvent: false });
    }

}