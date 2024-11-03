import { Component, OnDestroy } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import {
    ControlValueAccessor,
    FormBuilder,
    FormArray,
    FormGroup,
    ReactiveFormsModule,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { AppService } from '../../service/app.service';
import { Subscription } from 'rxjs';
import { NFeEmitAccordionComponent } from "./emit/nfe-emit-accordion.component";

@Component({
    selector: 'nfe',
    templateUrl: 'nfe.component.html',
    styleUrl: 'nfe.component.scss',
    standalone: true,
    imports: [
    CdkAccordionModule,
    CommonModule,
    ReactiveFormsModule,
    NFeEmitAccordionComponent
],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: NFeComponent
        },
        AppService,
    ]
})

export class NFeComponent implements ControlValueAccessor, OnDestroy {

    constructor(private formBuilder: FormBuilder, private appService: AppService) { }

    //#region Form

    public form: FormGroup = this.formBuilder.group({
        nfes: this.formBuilder.array([]),
    });

    public onTouched: Function = () => { };

    public onChangeSubs: Subscription[] = [];

    public registerOnChange(onChange: any): void {
        const sub = this.form.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.form.disable();
        else
            this.form.enable();
    }

    public writeValue(value: any): void {
        if (value)
            this.form.setValue(value, { emitEvent: false });
    }

    public ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    get nfes() {
        return this.form.get('nfes') as FormArray;
    }

    //#endregion

    public addDefaultNFe() {
        this.nfes.push(
            this.formBuilder.group(this.appService.getNFeDefaultFormValues())
        )
    }
}