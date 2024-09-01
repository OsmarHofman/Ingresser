import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import { ReleaseInputComponent } from './input/release-input.component';

@Component({
    selector: 'release-manager',
    templateUrl: './release-manager.component.html',
    styleUrls: ['./release-manager.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatFormField,
        MatLabel,
        MatCheckbox,
        ReleaseInputComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ReleaseManagerComponent
        }
    ]
})

export class ReleaseManagerComponent implements OnInit, ControlValueAccessor, OnDestroy {

    constructor(private formBuilder: FormBuilder) { }

    //#region Table

    public selectedRows: number[] = [];

    get releases() {
        return this.releaseForm.get('Releases') as FormArray;
    }

    public addRow() {
        this.releases.push(
            this.formBuilder.group({
                release: new FormControl(),
            })
        );
    }

    public removeRow() {
        this.selectedRows.sort((a, b) => b - a)
            .forEach(rowIndex => {
                this.releases.removeAt(rowIndex);
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

    //#region Form

    public releaseForm: FormGroup = this.formBuilder.group('');

    onTouched: Function = () => { };

    onChangeSubs: Subscription[] = [];
    
    public ngOnInit() {
        this.releaseForm = this.formBuilder.group({
            Releases: this.formBuilder.array([]),
        });
    }

    registerOnChange(onChange: any): void {
        const sub = this.releaseForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.releaseForm.disable();
        else
            this.releaseForm.enable();
    }

    writeValue(value: any): void {
        if (value)
            this.releaseForm.setValue(value, { emitEvent: false });
    }

    ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    //#endregion
}
