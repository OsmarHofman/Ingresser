import {
    Component,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShipmentBaseTag } from '../../../../model/xml-base-tags';
import { ShipmentHeaderInputComponent } from './input/shipment-header-input.component';

@Component({
    selector: 'shipment-header-tab',
    templateUrl: 'shipment-header-tab.component.html',
    styleUrl: 'shipment-header-tab.component.scss',
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

    constructor(private formBuilder: FormBuilder) {
        this.tabForm.controls['xmlContent'].setValue(ShipmentBaseTag.ShipmentHeader);
    }

    public tabChanged(event: MatTabChangeEvent): void {
        this.tabForm.controls['tabSelected'].setValue(event.index);
    }

    //#region Form

    public tabForm: FormGroup = this.formBuilder.group({
        inputContent: [''],
        xmlContent: [''],
        tabSelected: [0]
    });

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    public registerOnChange(onChange: any): void {
        const sub = this.tabForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.tabForm.disable();
        else
            this.tabForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.tabForm.setValue(value, { emitEvent: false });
    }

    //#endregion
}