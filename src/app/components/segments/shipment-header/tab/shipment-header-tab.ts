import {
    Component,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShipmentBaseTag } from '../../../../model/xml-base-tags/shipment';
import { ShipmentHeaderInputComponent } from './input/shipment-header-input';

@Component({
    selector: 'shipment-header-tab',
    templateUrl: 'shipment-header-tab.html',
    styleUrl: 'shipment-header-tab.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        ShipmentHeaderInputComponent,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ShipmentHeaderTabComponent
        }
    ]
})

export class ShipmentHeaderTabComponent implements ControlValueAccessor, OnDestroy {

    //#region Form

    tabForm: FormGroup = this.formBuilder.group({
        inputContent: [''],
        xmlContent: [''],
        tabSelected: [0]
    });

    constructor(private formBuilder: FormBuilder) { 
        this.tabForm.controls['xmlContent'].setValue(ShipmentBaseTag.ShipmentHeader);
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

    tabChanged(event: MatTabChangeEvent): void{
        this.tabForm.controls['tabSelected'].setValue(event.index);
    }

    //#endregion
}