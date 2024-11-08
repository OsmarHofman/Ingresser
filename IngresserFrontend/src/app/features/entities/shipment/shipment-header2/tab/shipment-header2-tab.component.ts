import {
    Component,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import {
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShipmentHeader2InputComponent } from './input/shipment-header2-input.component';

@Component({
    selector: 'shipment-header2-tab',
    templateUrl: 'shipment-header2-tab.component.html',
    styleUrl: 'shipment-header2-tab.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        ShipmentHeader2InputComponent,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ShipmentHeader2TabComponent
        }
    ]
})

export class ShipmentHeader2TabComponent implements ControlValueAccessor, OnDestroy {

    constructor(private formBuilder: FormBuilder) { }

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

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    //#endregion
}