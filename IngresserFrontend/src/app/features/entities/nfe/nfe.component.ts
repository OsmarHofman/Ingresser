import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ControlValueAccessor,
    FormBuilder,
    FormArray,
    FormGroup,
    ReactiveFormsModule,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { NFeParticipantAccordionComponent } from './participant/nfe-participant-accordion.component';
import { NFeIdeAccordionComponent } from "./ide/nfe-ide-accordion.component";
import { NFeInfAdicAccordionComponent } from "./infAdic/nfe-infAdic-accordion.component";
import { NFeOtherTagsAccordionComponent } from "./other-tags/nfe-other-tags-accordion.component";
import { Ide } from '../../../model/nfe';
import { AppService } from '../../service/app.service';
import { ExchangeParticipantsDialog } from '../../../components/dialogs/exchange-participants/exchange-participants-dialog.component';

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
        NFeInfAdicAccordionComponent,
        NFeOtherTagsAccordionComponent
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

    constructor(private formBuilder: FormBuilder,
        private appService: AppService,
        private dialog: MatDialog) { }

    //#region Form

    public form: FormGroup = this.formBuilder.group({
        nfes: this.formBuilder.array([]),
    });

    get nfes() {
        return this.form.get('nfes') as FormArray;
    }
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

    //#endregion

    //#region Retirada
    public getRetiradaState(): string {
        if (this.hasRetirada)
            return "Remover";

        return "Adicionar";
    }

    public changeRetiradaState() {
        this.hasRetirada = !this.hasRetirada;
    }

    //#endregion

    //#region Entrega

    public getEntregaState(): string {
        if (this.hasEntrega)
            return "Remover";

        return "Adicionar";
    }

    public changeEntregaState() {
        this.hasEntrega = !this.hasEntrega;
    }

    //#endregion

    public addDefaultNFe() {
        this.nfes.push(
            this.formBuilder.group(this.appService.getNFeDefaultFormValues())
        )
    }

    public exchangeParticipants() {
        let participants: string[] = ['Emitente', 'Destinatário'];

        if (this.hasRetirada)
            participants.push('Retirada');

        if (this.hasEntrega)
            participants.push('Entrega');

        const dialogRef = this.dialog.open(ExchangeParticipantsDialog, {
            data: participants,
        }
        );

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                //TODO: Implementar troca dos participantes
            }
        });
    }

    public getNFeNumberByIndex(index: number): string {
        const nfe: any = this.form.controls['nfes'].value[index].ide.tab;

        let nfeNumber = '';

        if (nfe) {

            if (nfe.tabSelected === 0) {
                nfeNumber = nfe.inputContent.number;
            } else {
                nfeNumber = Ide.getNFeNumberFromXml(nfe.xmlContent);
            }
        }

        return nfeNumber;
    }
}