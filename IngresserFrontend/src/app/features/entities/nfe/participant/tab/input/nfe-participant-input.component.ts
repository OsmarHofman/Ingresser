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

import { AddressComponent } from '../../../../../../components/address/address.component';

@Component({
    selector: 'nfe-participant-input',
    templateUrl: 'nfe-participant-input.component.html',
    styleUrl: 'nfe-participant-input.component.scss',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormField,
        MatLabel,
        AddressComponent,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: NFeParticipantInputComponent
        }
    ]
})

export class NFeParticipantInputComponent implements ControlValueAccessor, OnDestroy {

    constructor(private formBuilder: FormBuilder) { }

    //#region Form

    public inputForm: FormGroup = this.formBuilder.group({
        cnpj: [''],
        name: [''],
        address: ['']
    });

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.inputForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.inputForm.disable();
        else
            this.inputForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.inputForm.setValue(value, { emitEvent: false });
    }

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    //#endregion
}