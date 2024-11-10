import { Component, OnDestroy } from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

import { Subscription } from 'rxjs';

@Component({
    selector: 'document-address',
    templateUrl: 'address.component.html',
    styleUrl: 'address.component.scss',
    standalone: true,
    imports: [
        MatCardModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormField,
        MatLabel,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: AddressComponent
        }
    ]
})

export class AddressComponent implements ControlValueAccessor, OnDestroy {

    constructor(private formBuilder: FormBuilder) { }

    //#region Form

    public addressForm: FormGroup = this.formBuilder.group({
        ibgeCode: [''],
        city: [''],
        uf: ['']
    });

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.addressForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.addressForm.disable();
        else
            this.addressForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.addressForm.setValue(value, { emitEvent: false });
    }

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    //#endregion
}