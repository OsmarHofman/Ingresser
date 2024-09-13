import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShipmentHeaderAccordionComponent } from './features/segments/shipment-header/shipment-header-accordion.component';
import { ShipmentHeader2AccordionComponent } from './features/segments/shipment-header2/shipment-header2-accordion.component';
import { ShipmentStopAccordionComponent } from './features/segments/shipment-stop/shipment-stop-accordion.component';
import { LocationAccordionComponent } from './features/segments/location/location-accordion.component';
import { ReleaseAccordionComponent } from './features/segments/release/release-accordion.component';
import { AppService } from './features/service/app.service';
import { ShipmentBaseTag } from './model/xml-base-tags';

@Component({
  selector: 'app-root',
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
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {

  private appService: AppService = new AppService();

  constructor(private formBuilder: FormBuilder) {
  }

  //#region Form

  public form: FormGroup = this.formBuilder.group({
    shipmentHeader: [{
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
    }],
    shipmentHeader2: [{
      tab: {
        inputContent: {
          perspective: "Buy"
        },
        tabSelected: 0,
        xmlContent: ShipmentBaseTag.ShipmentHeader2
      }
    }],
    shipmentStop: [{
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
    }],
    location: [{
      tab: {
        inputContent: {
          Locations: [
            {
              location: {
                domainName: "EMBDEV",
                xid: "CAR-12521",
                city: "São Paulo",
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
                city: "São Paulo",
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
                      xid: "CLL_BAIRRO",
                      refnumValue: "BAIRRO10"
                    },
                  ]
                }
              }
            },
            {
              location: {
                domainName: "EMBDEV",
                xid: "ORG-8027-30018",
                city: "Lages",
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
                      xid: "CLL_BAIRRO",
                      refnumValue: "BAIRRO1"
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
    }],
    release: [{
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
    }],
  });

  public submitForm(): void {
    console.log('Formulario:', this.form.value);

    // if (this.validateForm())
    this.appService.convertFormToXml(this.form);
    // else
    //   alert('Alguma tag não foi preenchida! Favor verificar se os campos foram preenchidos ou selecionado a aba do xml!');
  }

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

  title = 'Ingresser';

  showShipmentAccordion: boolean = false;

  public createShipment() {
    this.showShipmentAccordion = true;
  }

  public deleteShipment() {
    if (confirm('Tem certeza que deseja remover esse embarque?')) {
      this.showShipmentAccordion = false;
    }
  }
}