import { CommonModule } from '@angular/common';
import {
    Component,
    OnDestroy,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';

import { Subscription } from 'rxjs';

import { NFeIdeInputComponent } from "./input/nfe-ide-input.component";

@Component({
    selector: 'nfe-ide-tab',
    templateUrl: 'nfe-ide-tab.component.html',
    styleUrl: 'nfe-ide-tab.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        ReactiveFormsModule,
        NFeIdeInputComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: NFeIdeTabComponent
        }
    ]
})

export class NFeIdeTabComponent implements ControlValueAccessor, OnDestroy {

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