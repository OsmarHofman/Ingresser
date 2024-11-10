import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormArray,
    FormsModule,
    ReactiveFormsModule,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';

import { Subscription } from 'rxjs';

import { LocationInputComponent } from './input/location-input.component';

@Component({
    selector: 'location-manager',
    templateUrl: './location-manager.component.html',
    styleUrls: ['./location-manager.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatCheckbox,
        LocationInputComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: LocationManagerComponent
        }
    ]
})

export class LocationManagerComponent implements ControlValueAccessor, OnDestroy {

    constructor(private formBuilder: FormBuilder) {
        this.addRow();
        this.addRow();
        this.addRow();
    }

    //#region Form

    public locationForm: FormGroup = this.formBuilder.group({
        locations: this.formBuilder.array([]),
    });

    get locations() {
        return this.locationForm.get('locations') as FormArray;
    }

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.locationForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.locationForm.disable();
        else
            this.locationForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.locationForm.setValue(value, { emitEvent: false });
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
        this.locations.push(
            this.formBuilder.group({
                location: new FormControl(),
            })
        );
    }

    public removeRow() {
        this.selectedRows.sort((a, b) => b - a)
            .forEach(rowIndex => {
                this.locations.removeAt(rowIndex);
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
