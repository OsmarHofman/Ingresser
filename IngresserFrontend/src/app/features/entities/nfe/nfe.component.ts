import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ControlValueAccessor,
    FormBuilder,
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
import { Ide, NFe, NFeParticipantType, NFeParticipantTypeFormName } from '../../../model/nfe';
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
    ]
})

export class NFeComponent implements ControlValueAccessor, OnDestroy {

    public hasRetirada: boolean = false;
    public hasEntrega: boolean = false;

    constructor(private formBuilder: FormBuilder,
        private dialog: MatDialog) { }

    //#region Form

    public form: FormGroup = this.formBuilder.group({
        ide: [''],
        emit: [''],
        dest: [''],
        retirada: [''],
        entrega: [''],
        otherTags: [''],
        infAdic: ['']
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
        this.form.setValue(NFe.getNFeDefaultFormValues());
    }

    public getNFeNumber(): string {
        const ide: any = this.form.controls['ide'].value.tab;

        let nfeNumber = '';

        if (ide) {

            if (ide.tabSelected === 0) {
                nfeNumber = ide.inputContent.number;
            } else {
                nfeNumber = Ide.getNFeNumberFromXml(ide.xmlContent);
            }
        }

        return nfeNumber;
    }

    public exchangeParticipants() {
        let participants: NFeParticipantType[] = [NFeParticipantType.Emit, NFeParticipantType.Dest];

        if (this.hasRetirada)
            participants.push(NFeParticipantType.Retirada);

        if (this.hasEntrega)
            participants.push(NFeParticipantType.Entrega);

        const dialogRef = this.dialog.open(ExchangeParticipantsDialog, {
            data: participants,
        }
        );

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.exchangeTwoParticipants(result[0], result[1])
            }
        });
    }

    private exchangeTwoParticipants(participantOneName: NFeParticipantType, participantTwoName: NFeParticipantType): void {

        const participantOne: string = NFeParticipantTypeFormName.get(participantOneName)!;
        const participantTwo: string = NFeParticipantTypeFormName.get(participantTwoName)!;

        const participantOneFormControl: any = this.form.controls[participantOne].value;
        this.form.controls[participantOne].setValue(this.form.controls[participantTwo].value);
        this.form.controls[participantTwo].setValue(participantOneFormControl);
    }

}