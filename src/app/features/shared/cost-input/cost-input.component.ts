import { Component, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CostTableComponent } from './accessory-cost/accessory-cost.component';


@Component({
    selector: 'cost-input',
    templateUrl: 'cost-input.component.html',
    styleUrl: 'cost-input.component.scss',
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

    constructor(private formBuilder: FormBuilder) { }

    //#region Form
    
    public costInputForm: FormGroup = this.formBuilder.group({
        baseCost: [''],
        acessorialCost: [''],
        totalCost: [''],
    });

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.costInputForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.costInputForm.disable();
        else
            this.costInputForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.costInputForm.setValue(value, { emitEvent: false });
    }
    
    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    //#endregion
}