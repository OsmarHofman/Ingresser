import { Component, Input, OnDestroy } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AccordionItem } from './model/accordion-item';
import { TabComponent } from '../tab/tab';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'accordion-with-tab',
    templateUrl: 'accordion-with-tab.html',
    styleUrl: 'accordion-with-tab.scss',
    standalone: true,
    imports: [
        CdkAccordionModule,
        TabComponent,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: AccordionWithTabComponent
        }
    ]
})

export class AccordionWithTabComponent implements ControlValueAccessor, OnDestroy {

    @Input() items: AccordionItem[] = [];

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