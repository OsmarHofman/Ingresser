import { Component, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CostTableComponent } from './cost-table/cost-table';


@Component({
    selector: 'cost-input',
    templateUrl: 'cost-input.html',
    styleUrl: 'cost-input.scss',
    standalone: true,
    imports: [
        MatCardModule,
        CostTableComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatFormField,
        MatLabel,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: CostInputComponent
        }
    ]
})

export class CostInputComponent implements ControlValueAccessor, OnDestroy {

    costInputForm: FormGroup = this.formBuilder.group({
        baseCost: [''],
        acessorialCost: [''],
        totalCost: [''],
    });

    onTouched: Function = () => { };

    onChangeSubs: Subscription[] = [];

    constructor(private formBuilder: FormBuilder) { }

    ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    registerOnChange(onChange: any): void {
        const sub = this.costInputForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.costInputForm.disable();
        else
            this.costInputForm.enable();
    }

    writeValue(value: any): void {
        if (value)
            this.costInputForm.setValue(value, { emitEvent: false });
    }
}