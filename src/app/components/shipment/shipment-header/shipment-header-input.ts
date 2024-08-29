import { Component } from '@angular/core';
import { CarrierInputContainerComponent } from "./carrier-input-container/carrier-input-container";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RefnumTableComponent } from '../../collections/refnum-table/refnum-table';

@Component({
    selector: 'shipment-header-input',
    templateUrl: 'shipment-header-input.html',
    styleUrl: 'shipment-header-input.scss',
    standalone: true,
    imports: [
        RefnumTableComponent,
        CarrierInputContainerComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatFormField,
        MatLabel,
    ],
})

export class ShipmentHeaderInputComponent {
    shipmentHeaderForm: any;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.shipmentHeaderForm = this.formBuilder.group({
            shipmentDomainName: [''],
            shipmentXid: [''],
            travelStatus: [''],
            emissionStatus: [''],
            shipmentTaker: [''],
            shipmentCarrier: [''],
            shipmentRefnums: ['']
        });
    }

    submitForm(): void {
        console.log('Formulario:', this.shipmentHeaderForm.value);
    }
}