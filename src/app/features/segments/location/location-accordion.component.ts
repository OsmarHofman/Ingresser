import { Component, OnDestroy } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationTabComponent } from './tab/location-tab.component';

@Component({
    selector: 'location-accordion',
    templateUrl: 'location-accordion.html',
    styleUrl: 'location-accordion.scss',
    standalone: true,
    imports: [
        CdkAccordionModule,
        LocationTabComponent,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: LocationAccordionComponent
        }
    ]
})

export class LocationAccordionComponent implements ControlValueAccessor, OnDestroy {

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