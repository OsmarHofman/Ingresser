import { CommonModule } from '@angular/common';
import { Component,  OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
    selector: 'order-movement',
    templateUrl: './order-movement.component.html',
    styleUrls: ['./order-movement.component.scss'],
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
            useExisting: OrderMovementComponent
        }
    ]
})

export class OrderMovementComponent implements ControlValueAccessor, OnDestroy {

    constructor(private formBuilder: FormBuilder) { 
        this.addRow();
    }

    //#region Table

    public selectedRows: number[] = [];

    get movements() {
        return this.tableForm.get('Movements') as FormArray;
    }

    public addRow() {
        this.movements.push(
            this.formBuilder.group({
                shipFrom: new FormControl(),
                shipTo: new FormControl(),
            })
        );
    }

    public removeRow() {
        this.selectedRows.sort((a, b) => b - a)
            .forEach(rowIndex => {
                this.movements.removeAt(rowIndex);
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

    public tableForm: FormGroup = this.formBuilder.group({
        Movements: this.formBuilder.array([]),
    });

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
}
