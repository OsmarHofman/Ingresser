import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogActions,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'exchange-participants-dialog',
    templateUrl: 'exchange-participants-dialog.component.html',
    styleUrl: 'exchange-participants-dialog.component.scss',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogActions,
        MatSelectModule,
    ]
})

export class ExchangeParticipantsDialog {

    readonly dialogRef = inject(MatDialogRef<ExchangeParticipantsDialog>);
    readonly participants = inject<string[]>(MAT_DIALOG_DATA);

    public firstParticipantToExchange: string = this.participants[0];
    public secondParticipantToExchange: string = this.participants[1];


    public onNoClick(): void {
        this.dialogRef.close();
    }

    public returnParticipantsToExchange(): void {
        this.dialogRef.close([this.firstParticipantToExchange, this.secondParticipantToExchange]);
    }
}