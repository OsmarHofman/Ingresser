import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
    selector: 'refnum',
    templateUrl: './refnum.html',
    styleUrls: ['./refnum.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatFormField,
        MatLabel,
        MatCheckbox
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: RefnumComponent
        }
    ]
})

export class RefnumComponent implements OnInit, ControlValueAccessor, OnDestroy {
    
    tableForm: FormGroup = this.formBuilder.group('');

    constructor(private formBuilder: FormBuilder) { }

    //#region Grid

    selectedRows: number[] = [];

    get refnums() {
        return this.tableForm.get('Refnums') as FormArray;
    }

    ngOnInit() {
        this.tableForm = this.formBuilder.group({
            Refnums: this.formBuilder.array([]),
        });
    }

    addRow() {
        this.refnums.push(
            this.formBuilder.group({
                domainName: new FormControl(),
                xid: new FormControl(),
                refnumValue: new FormControl(),
            })
        );
    }

    removeRow() {
        this.selectedRows.sort((a, b) => b - a)
            .forEach(rowIndex => {
                this.refnums.removeAt(rowIndex);
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
        const sub = this.tableForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.tableForm.disable();
        else
            this.tableForm.enable();
    }

    writeValue(value: any): void {
        if (value)
            this.tableForm.setValue(value, { emitEvent: false });
    }

    //#endregion
}
