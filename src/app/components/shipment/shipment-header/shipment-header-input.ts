import { Component } from '@angular/core';
import { GridComponent } from '../../grid/grid';
import { CarrierInputContainerComponent } from "./carrier-input-container/carrier-input-container";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'shipment-header-input',
    templateUrl: 'shipment-header-input.html',
    styleUrl: 'shipment-header-input.scss',
    standalone: true,
    imports: [
        GridComponent,
        CarrierInputContainerComponent,
        ReactiveFormsModule
    ],
})

export class ShipmentHeaderInputComponent {
    shipmentHeaderForm: any;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.shipmentHeaderForm = this.formBuilder.group({
            shipmentDomainName: [''],
            shipmentCarrier: ['']
        });
    }

    submitForm(): void {
        console.log('Formulario:', this.shipmentHeaderForm.value);
    }
}