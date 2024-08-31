import { Component, OnDestroy } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShipmentHeader2TabComponent } from './tab/shipment-header2-tab';

@Component({
    selector: 'shipment-header2-accordion',
    templateUrl: 'shipment-header2-accordion.html',
    styleUrl: 'shipment-header2-accordion.scss',
    standalone: true,
    imports: [
        CdkAccordionModule,
        ShipmentHeader2TabComponent,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ShipmentHeader2AccordionComponent
        }
    ]
})

export class ShipmentHeader2AccordionComponent implements ControlValueAccessor, OnDestroy {

    accordionForm: FormGroup = this.formBuilder.group({
        tab: ['']
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
        const sub = this.accordionForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.accordionForm.disable();
        else
            this.accordionForm.enable();
    }

    writeValue(value: any): void {
        if (value)
            this.accordionForm.setValue(value, { emitEvent: false });
    }
}