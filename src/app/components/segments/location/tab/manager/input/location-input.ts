import { Component, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { RefnumComponent } from '../../../../shipment-header/tab/input/refnum/refnum';

@Component({
    selector: 'location-input',
    templateUrl: 'location-input.html',
    styleUrl: 'location-input.scss',
    standalone: true,
    imports: [
        RefnumComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatFormField,
        MatLabel,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: LocationInputComponent
        }
    ]
})

export class LocationInputComponent implements ControlValueAccessor, OnDestroy {

    locationForm: FormGroup = this.formBuilder.group({
        locationDomainName: [''],
        locationXid: [''],
        city: [''],
        uf: [''],
        refnums: ['']
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
        const sub = this.locationForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.locationForm.disable();
        else
            this.locationForm.enable();
    }

    writeValue(value: any): void {
        if (value)
            this.locationForm.setValue(value, { emitEvent: false });
    }

}