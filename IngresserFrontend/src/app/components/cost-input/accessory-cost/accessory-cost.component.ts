import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';

import { Subscription } from 'rxjs';

@Component({
    selector: 'accessory-cost',
    templateUrl: './accessory-cost.component.html',
    styleUrls: ['./accessory-cost.component.scss'],
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
            useExisting: CostTableComponent
        }
    ]
})

export class CostTableComponent implements OnInit, ControlValueAccessor, OnDestroy {

    constructor(private formBuilder: FormBuilder) { }

    //#region Form

    public costForm: FormGroup = this.formBuilder.group('');

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public ngOnInit() {
        this.costForm = this.formBuilder.group({
            costs: this.formBuilder.array([]),
        });
    }

    get costs() {
        return this.costForm.get('costs') as FormArray;
    }

    public registerOnChange(onChange: any): void {
        const sub = this.costForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.costForm.disable();
        else
            this.costForm.enable();
    }

    public writeValue(value: any): void {
        if (value) {
            if (typeof (value) === "object" && value.length === 0) return;

            if (value.costs) {
                value.costs.forEach((cost: any) => {
                    this.addRowWithXidAndValue(cost.xid, cost.costValue);
                });
            }

            else this.costForm.setValue(value, { emitEvent: false });
        }
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
        this.costs.push(
            this.formBuilder.group({
                xid: new FormControl(),
                costValue: new FormControl(),
            })
        );
    }

    public addRowWithXidAndValue(xid: string, value: string) {
        this.costs.push(
            this.formBuilder.group({
                xid: xid,
                costValue: value,
            })
        );
    }

    public removeRow() {
        this.selectedRows.sort((a, b) => b - a)
            .forEach(rowIndex => {
                this.costs.removeAt(rowIndex);
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
