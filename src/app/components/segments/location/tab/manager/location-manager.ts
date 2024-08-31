import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import { LocationInputComponent } from './input/location-input';

@Component({
    selector: 'location-manager',
    templateUrl: './location-manager.html',
    styleUrls: ['./location-manager.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatFormField,
        MatLabel,
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

export class LocationManagerComponent implements OnInit, ControlValueAccessor, OnDestroy {
    
    locationForm: FormGroup = this.formBuilder.group('');

    constructor(private formBuilder: FormBuilder) { }

    //#region Grid

    selectedRows: number[] = [];

    get locations() {
        return this.locationForm.get('Locations') as FormArray;
    }

    ngOnInit() {
        this.locationForm = this.formBuilder.group({
            Locations: this.formBuilder.array([]),
        });
    }

    addRow() {
        this.locations.push(
            this.formBuilder.group({
                location: new FormControl(),
            })
        );
    }

    removeRow() {
        this.selectedRows.sort((a, b) => b - a)
            .forEach(rowIndex => {
                this.locations.removeAt(rowIndex);
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

    //#endregion
}
