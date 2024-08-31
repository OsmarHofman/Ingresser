import { Component, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { RefnumComponent } from '../../../../shipment-header/tab/input/refnum/refnum';
import { OrderMovementComponent } from "./movement/order-movement";

@Component({
    selector: 'release-input',
    templateUrl: 'release-input.html',
    styleUrl: 'release-input.scss',
    standalone: true,
    imports: [
    RefnumComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatFormField,
    MatLabel,
    OrderMovementComponent
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

    releaseForm: FormGroup = this.formBuilder.group({
        releaseDomainName: [''],
        releaseXid: [''],
        shipFrom: [''],
        shipTo: [''],
        refnums: [''],
        orderMovement: ['']
    });

    constructor(private formBuilder: FormBuilder) { }

    onTouched: Function = () => { };

    onChangeSubs: Subscription[] = [];

    ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
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

}