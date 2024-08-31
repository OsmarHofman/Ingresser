import {
    Component,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShipmentBaseTag } from '../../../../model/xml-base-tags/shipment';
import { ShipmentStopInputComponent } from './input/shipment-stop-input';

@Component({
    selector: 'shipment-stop-tab',
    templateUrl: 'shipment-stop-tab.html',
    styleUrl: 'shipment-stop-tab.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        ShipmentStopInputComponent,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ShipmentStopTabComponent
        }
    ]
})

export class ShipmentStopTabComponent implements ControlValueAccessor, OnDestroy {

    //#region Form

    tabForm: FormGroup = this.formBuilder.group({
        inputContent: [''],
        xmlContent: [''],
    });

    constructor(private formBuilder: FormBuilder) {
        this.tabForm.controls['xmlContent'].setValue(ShipmentBaseTag.ShipmentStop);
    }

    onTouched: Function = () => { };

    onChangeSubs: Subscription[] = [];

    ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    registerOnChange(onChange: any): void {
        const sub = this.tabForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.tabForm.disable();
        else
            this.tabForm.enable();
    }

    writeValue(value: any): void {
        if (value)
            this.tabForm.setValue(value, { emitEvent: false });
    }

    //#endregion
}