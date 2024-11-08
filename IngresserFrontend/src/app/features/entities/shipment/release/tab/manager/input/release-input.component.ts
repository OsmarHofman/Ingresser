import { Component, OnDestroy } from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { RefnumComponent } from '../../../../../../../components/refnum/refnum.component';
import { OrderMovementComponent } from "./movement/order-movement.component";
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { CostInputComponent } from '../../../../../../../components/cost-input/cost-input.component';

@Component({
    selector: 'release-input',
    templateUrl: 'release-input.component.html',
    styleUrl: 'release-input.component.scss',
    standalone: true,
    imports: [
        RefnumComponent,
        OrderMovementComponent,
        CostInputComponent,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormField,
        MatLabel,
        MatCheckbox
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ReleaseInputComponent
        }
    ]
})

export class ReleaseInputComponent implements ControlValueAccessor, OnDestroy {

    public enableCost: boolean = true;

    constructor(private formBuilder: FormBuilder) { }

    public enableCostInputs(): void {
        this.enableCost = !this.enableCost;
    }

    //#region Form

    public releaseForm: FormGroup = this.formBuilder.group({
        releaseDomainName: [''],
        releaseXid: [''],
        shipFrom: [''],
        shipTo: [''],
        refnums: [''],
        orderMovement: [''],
        taker: [''],
        releaseCost: ['']
    });

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.releaseForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.releaseForm.disable();
        else
            this.releaseForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.releaseForm.setValue(value, { emitEvent: false });
    }

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    //#endregion
}