import { Component, OnDestroy } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import {
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { NFeEmitTabComponent } from './tab/nfe-emit-tab.component';

@Component({
    selector: 'nfe-emit-accordion',
    templateUrl: 'nfe-emit-accordion.component.html',
    styleUrl: 'nfe-emit-accordion.component.scss',
    standalone: true,
    imports: [
        CdkAccordionModule,
        ReactiveFormsModule,
        NFeEmitTabComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: NFeEmitAccordionComponent
        }
    ]
})

export class NFeEmitAccordionComponent implements ControlValueAccessor, OnDestroy {

    constructor(private formBuilder: FormBuilder) { }

    //#region Form

    public accordionForm: FormGroup = this.formBuilder.group({
        tab: ['']
    });

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.accordionForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.accordionForm.disable();
        else
            this.accordionForm.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.accordionForm.setValue(value, { emitEvent: false });
    }

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    //#endregion
}