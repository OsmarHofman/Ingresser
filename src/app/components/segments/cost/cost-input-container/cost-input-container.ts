import { Component, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ControlValueAccessor, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CostTableComponent } from './cost-table/cost-table';


@Component({
    selector: 'cost-input-container',
    templateUrl: 'cost-input-container.html',
    styleUrl: 'cost-input-container.scss',
    standalone: true,
    imports: [
        MatCardModule,
        CostTableComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatFormField,
        MatLabel,
    ],
})

export class CostInputContainerComponent implements ControlValueAccessor, OnDestroy {

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