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
import { NFeParticipantAccordionComponent } from './participant/nfe-participant-accordion.component';
import { NFeIdeAccordionComponent } from "./ide/nfe-ide-accordion.component";
import { NFeInfAdicAccordionComponent } from "./infAdic/nfe-infAdic-accordion.component";

@Component({
    selector: 'nfe',
    templateUrl: 'nfe.component.html',
    styleUrl: 'nfe.component.scss',
    standalone: true,
    imports: [
        CdkAccordionModule,
        CommonModule,
        ReactiveFormsModule,
        NFeParticipantAccordionComponent,
        NFeIdeAccordionComponent,
        NFeInfAdicAccordionComponent
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

    public hasRetirada: boolean = false;
    public hasEntrega: boolean = false;

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

    public getRetiradaState(): string {
        if (this.hasRetirada)
            return "Remover";

        return "Adicionar";
    }

    public changeRetiradaState() {
        this.hasRetirada = !this.hasRetirada;
    }

    public getEntregaState(): string {
        if (this.hasEntrega)
            return "Remover";

        return "Adicionar";
    }

    public changeEntregaState() {
        this.hasEntrega = !this.hasEntrega;
    }

    public exchangeParticipants() {
        //TODO: Colocar um dialog que seleciona quais os participantes a serem invertidos
    }
}