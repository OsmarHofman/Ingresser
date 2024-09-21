import { Component, Injectable, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ShipmentHeaderAccordionComponent } from './shipment-header/shipment-header-accordion.component';
import { ShipmentHeader2AccordionComponent } from './shipment-header2/shipment-header2-accordion.component';
import { ShipmentStopAccordionComponent } from './shipment-stop/shipment-stop-accordion.component';
import { LocationAccordionComponent } from './location/location-accordion.component';
import { ReleaseAccordionComponent } from './release/release-accordion.component';
import { Subscription } from 'rxjs';
import { ShipmentBaseTag } from '../../../model/xml-base-tags';

@Component({
  selector: 'shipment',
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.scss',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    ShipmentHeaderAccordionComponent,
    ShipmentHeader2AccordionComponent,
    ShipmentStopAccordionComponent,
    LocationAccordionComponent,
    ReleaseAccordionComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ShipmentComponent
    }
  ],
})


@Injectable()
export class ShipmentComponent implements ControlValueAccessor, OnDestroy {

  constructor(private formBuilder: FormBuilder) { }

  //#region Form

  public form: FormGroup = this.formBuilder.group({
    shipments: this.formBuilder.array([]),
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

  get shipments() {
    return this.form.get('shipments') as FormArray;
  }

  //#endregion

  //#region Validation

  private validateForm(): boolean {

    if (!this.validateFormControls()) return false;

    return true;
  }

  private validateFormControls(): boolean {

    /*O Cost não é validado aqui, pois se ele for preenchido manualmente será usado 
      tanto no embarque quanto na release. Mas caso use o xml no shipmentHeader e na
      release, terá que colocar em cada um. Então depois tem que ser validado se o cost
      foi preenchido manualmente ou se está no xml do embarque ou da release
    */
    const controlNames = ['shipmentHeader', 'shipmentHeader2', 'shipmentStop', 'location', 'release'];

    return controlNames.every(controlName => this.form.controls[controlName].value);
  }

  //#endregion


  public addShipment() {
    this.shipments.push(
      this.formBuilder.group({
        shipmentHeader: {
          tab: {
            inputContent: {
              emissionStatus: "PRE_EMISSAO_ENVIADA",
              shipmentCarrier: {
                domainName: "EMBDEV",
                xid: "CAR-12521"
              },
              shipmentCost: {
                acessorialCost: "",
                baseCost: "100",
                totalCost: "100"
              },
              shipmentDomainName: "EMBDEV",
              shipmentRefnums: {
                Refnums: [
                  {
                    domainName: "EMBDEV",
                    xid: "CLL_IMPOSTO_SOMADO",
                    refnumValue: "N"
                  },
                  {
                    domainName: "EMBDEV",
                    xid: "CLL_IMPOSTO_INCLUSO",
                    refnumValue: "S"
                  }
                ]
              },
              shipmentTaker: "ORG-8027-30018",
              shipmentXid: "EMBARQUE1",
              travelStatus: "PLANEJADO"
            },
            tabSelected: 0,
            xmlContent: ShipmentBaseTag.ShipmentHeader
          }
        },
        shipmentHeader2: {
          tab: {
            inputContent: {
              perspective: "Buy"
            },
            tabSelected: 0,
            xmlContent: ShipmentBaseTag.ShipmentHeader2
          }
        },
        shipmentStop: {
          tab: {
            inputContent: {
              stops: [
                {
                  locationDomainName: "EMBDEV",
                  locationXid: "LOCATION7",
                  stopSequence: 1,
                  stopType: "Coleta"
                },
                {
                  locationDomainName: "EMBDEV",
                  locationXid: "ORG-8027-30018",
                  stopSequence: 2,
                  stopType: "Entrega"
                }
              ]
            },
            tabSelected: 0,
            xmlContent: ShipmentBaseTag.ShipmentStop
          }
        },
        location: {
          tab: {
            inputContent: {
              locations: [
                {
                  location: {
                    domainName: "EMBDEV",
                    xid: "CAR-12521",
                    city: "SAO PAULO",
                    uf: "SP",
                    refnums: {
                      Refnums: [
                        {
                          domainName: "EMBDEV",
                          xid: "CLL_CNPJ",
                          refnumValue: "00720785000177"
                        },
                        {
                          domainName: "EMBDEV",
                          xid: "CLL_CODIGO_IBGE",
                          refnumValue: "3550308"
                        },
                        {
                          domainName: "EMBDEV",
                          xid: "CLL_TIPO_TRANSPORTADOR",
                          refnumValue: "ETC_NORMAL"
                        },
                      ]
                    }
                  }
                },
                {
                  location: {
                    domainName: "EMBDEV",
                    xid: "LOCATION7",
                    city: "SAO PAULO",
                    uf: "SP",
                    refnums: {
                      Refnums: [
                        {
                          domainName: "EMBDEV",
                          xid: "CLL_CNPJ",
                          refnumValue: "96973902000183"
                        },
                        {
                          domainName: "EMBDEV",
                          xid: "CLL_CODIGO_IBGE",
                          refnumValue: "3550308"
                        },
                        {
                          domainName: "EMBDEV",
                          xid: "CLL_RAZAO_SOCIAL",
                          refnumValue: "GALPAO"
                        },
                      ]
                    }
                  }
                },
                {
                  location: {
                    domainName: "EMBDEV",
                    xid: "ORG-8027-30018",
                    city: "LAGES",
                    uf: "SC",
                    refnums: {
                      Refnums: [
                        {
                          domainName: "EMBDEV",
                          xid: "CLL_CNPJ",
                          refnumValue: "05257045000160"
                        },
                        {
                          domainName: "EMBDEV",
                          xid: "CLL_CODIGO_IBGE",
                          refnumValue: "4209300"
                        },
                        {
                          domainName: "EMBDEV",
                          xid: "CLL_RAZAO_SOCIAL",
                          refnumValue: "MATRIZ 12"
                        },
                      ]
                    }
                  }
                },

              ]
            },
            tabSelected: 0,
            xmlContent: ShipmentBaseTag.Location
          }
        },
        release: {
          tab: {
            inputContent: {
              Releases: [{
                release: {
                  releaseDomainName: "EMBDEV",
                  releaseXid: "ORDEM1",
                  shipFrom: "LOCATION7",
                  shipTo: "ORG-8027-30018",
                  taker: "ORG-8027-30018",
                  orderMovement: {
                    Movements: [{
                      shipFrom: "LOCATION7",
                      shipTo: "ORG-8027-30018",
                    }],
                  },
                  refnums: "",
                  releaseCost: ''
                }
              }]
            },
            tabSelected: 0,
            xmlContent: ShipmentBaseTag.Release
          }
        },

      })
    )
  }
}