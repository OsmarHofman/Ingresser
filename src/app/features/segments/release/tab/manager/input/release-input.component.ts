import { Component, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { RefnumComponent } from '../../../../../shared/refnum/refnum.component';
import { OrderMovementComponent } from "./movement/order-movement.component";

@Component({
    selector: 'release-input',
    templateUrl: 'release-input.component.html',
    styleUrl: 'release-input.component.scss',
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

    constructor(private formBuilder: FormBuilder) { }
    
    //#region Form

    public releaseForm: FormGroup = this.formBuilder.group({
        releaseDomainName: [''],
        releaseXid: [''],
        shipFrom: [''],
        shipTo: [''],
        refnums: [''],
        orderMovement: ['']
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