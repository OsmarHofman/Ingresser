import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormArray,
    FormsModule,
    ReactiveFormsModule,
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';

import { Subscription } from 'rxjs';

@Component({
    selector: 'refnum',
    templateUrl: './refnum.component.html',
    styleUrls: ['./refnum.component.scss'],
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

    @Input() public colClass: string = 'col-md-6';

    @Input() public defaultRowCount: number = 2;

    constructor(private formBuilder: FormBuilder) { }

    public ngOnInit(): void {
        for (let index = 0; index < this.defaultRowCount; index++) {
            this.addRow();
        }
    }

    //#region Form

    public tableForm: FormGroup = this.formBuilder.group({
        Refnums: this.formBuilder.array([]),
    });

    get refnums() {
        return this.tableForm.get('Refnums') as FormArray;
    }

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.tableForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.tableForm.disable();
        else
            this.tableForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.tableForm.setValue(value, { emitEvent: false });
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
        this.refnums.push(
            this.formBuilder.group({
                domainName: new FormControl(),
                xid: new FormControl(),
                refnumValue: new FormControl(),
            })
        );
    }

    public removeRow() {
        this.selectedRows.sort((a, b) => b - a)
            .forEach(rowIndex => {
                this.refnums.removeAt(rowIndex);
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
