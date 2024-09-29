import { FormGroup } from "@angular/forms";
import { OrderMovement, Shipment, ShipmentHeader, ShipmentHeader2 } from "../../model/shipment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ShipmentBaseTag } from "../../model/xml-base-tags";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'ReceiveTransmission'
    })
};

@Injectable()
export class AppService {

    public wsUrl = 'pr.nddfrete.com.br/1046/tmsExchangeMessage/TMSExchangeMessage'

    constructor(private http: HttpClient) {

    }

    public convertFormToXml(form: FormGroup): void {

        let xmlsToSend: string[] = [];

        const formShipments = form.controls['shipment'].value.shipments;

        formShipments.forEach((formShipment: any) => {
            const shipment: Shipment = new Shipment(formShipment);

            const currentTime = new Date();

            const gLogDate: string = String(currentTime.getFullYear()) +
                String(currentTime.getMonth()).padStart(2, '0') +
                String(currentTime.getDate()).padStart(2, '0') +
                String(currentTime.getHours()).padStart(2, '0') +
                String(currentTime.getMinutes()).padStart(2, '0') +
                String(currentTime.getSeconds()).padStart(2, '0');

            let shipmentXml: string = '';

            const shipmentHeaderTab = formShipment.shipmentHeader.tab;

            let shipmentXid: string;
            let carrierXid: string;

            if (shipmentHeaderTab.tabSelected === 0) {
                shipmentXml += shipment.convertShipmentHeaderToXml();
                shipmentXid = shipment.shipmentHeader.shipmentXid;
                carrierXid = shipment.shipmentHeader.carrierXid;
            } else {
                shipmentXml += shipmentHeaderTab.xmlContent;
                shipmentXid = ShipmentHeader.getShipmentXidFromXml(shipmentXml);
                carrierXid = ShipmentHeader.getCarrierXidFromXml(shipmentXml);
            }

            shipmentXml += "\n";

            const shipmentHeader2Tab = formShipment.shipmentHeader2.tab;

            let shipmentPerspective: string;

            if (shipmentHeader2Tab.tabSelected === 0) {
                shipmentXml += shipment.convertShipmentHeader2ToXml();
                shipmentPerspective = shipment.shipmentHeader2.perspective;
            } else {
                shipmentXml += shipmentHeader2Tab.xmlContent;
                shipmentPerspective = ShipmentHeader2.getPerspectiveFromXml(shipmentXml);
            }

            shipmentXml += "\n";

            const shipmentStopTab = formShipment.shipmentStop.tab;

            if (shipmentStopTab.tabSelected === 0) {
                shipmentXml += shipment.convertShipmentStopToXml();
            } else {
                shipmentXml += shipmentStopTab.xmlContent;
            }

            shipmentXml += "\n";

            const shipmentLocationTab = formShipment.location.tab;

            if (shipmentLocationTab.tabSelected === 0) {
                shipmentXml += shipment.convertLocationToXml();
            } else {
                shipmentXml += shipmentLocationTab.xmlContent;
            }

            shipmentXml += "\n";

            const shipmentReleaseTab = formShipment.release.tab;

            if (shipmentReleaseTab.tabSelected === 0) {
                shipmentXml += shipment.convertReleaseToXml(shipmentXid, shipmentPerspective, carrierXid);
            } else {
                shipmentXml += shipmentReleaseTab.xmlContent;
            }

            shipmentXml += "\n";

            let finalXml: string = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tms="http://tempuri.org/tms">
        <soap:Header/>
        <soap:Body>
            <Transmission xmlns="http://xmlns.oracle.com/apps/otm/transmission/v6.4">
                <otm:TransmissionHeader xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4"
                    xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
                    <otm:Version>20a</otm:Version>
                    <otm:TransmissionCreateDt>
                        <otm:GLogDate>${gLogDate}</otm:GLogDate>
                        <otm:TZId>UTC</otm:TZId>
                        <otm:TZOffset>+00:00</otm:TZOffset>
                    </otm:TransmissionCreateDt>
                    <otm:TransactionCount>1</otm:TransactionCount>
                    <otm:SenderHostName>https://otmgtm-test-a507789.otm.us2.oraclecloud.com:443</otm:SenderHostName>
                    <otm:SenderSystemID>https://otmgtm-test-a507789.otm.us2.oraclecloud.com:443</otm:SenderSystemID>
                    <otm:SenderTransmissionNo>328969</otm:SenderTransmissionNo>
                    <otm:ReferenceTransmissionNo>0</otm:ReferenceTransmissionNo>
                    <otm:GLogXMLElementName>PlannedShipment</otm:GLogXMLElementName>
                    <otm:NotifyInfo>
                        <otm:ContactGid>
                            <otm:Gid>
                                <otm:DomainName>EMBDEV</otm:DomainName>
                                <otm:Xid>TEST</otm:Xid>
                            </otm:Gid>
                        </otm:ContactGid>
                        <otm:ExternalSystemGid>
                            <otm:Gid>
                                <otm:DomainName>EMBDEV</otm:DomainName>
                                <otm:Xid>TEST</otm:Xid>
                            </otm:Gid>
                        </otm:ExternalSystemGid>
                    </otm:NotifyInfo>
                </otm:TransmissionHeader>
                <TransmissionBody>
                    <GLogXMLElement>
                        <otm:TransactionHeader xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4" xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
                        <otm:SenderTransactionId>70352</otm:SenderTransactionId>
                        <otm:SendReason>
                            <otm:Remark>
                                <otm:RemarkSequence>1</otm:RemarkSequence>
                                <otm:RemarkQualifierGid>
                                    <otm:Gid>
                                        <otm:Xid>QUERY TYPE</otm:Xid>
                                    </otm:Gid>
                                </otm:RemarkQualifierGid>
                                <otm:RemarkText>SHIPMENT</otm:RemarkText>
                            </otm:Remark>
                            <otm:SendReasonGid>
                                <otm:Gid>
                                    <otm:Xid>SEND INTEGRATION</otm:Xid>
                                </otm:Gid>
                            </otm:SendReasonGid>
                            <otm:ObjectType>SHIPMENT</otm:ObjectType>
                        </otm:SendReason>
                    </otm:TransactionHeader>
                        <otm:PlannedShipment xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4"
                            xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
                            <otm:Shipment>
                                [[Shipment]]
                            </otm:Shipment>
                        </otm:PlannedShipment>
                    </GLogXMLElement>
                </TransmissionBody>
            </Transmission>
        </soap:Body>
    </soap:Envelope>`.replace('[[Shipment]]', shipmentXml);

            xmlsToSend.push(finalXml);
        });

        xmlsToSend.forEach((xmlToSend: string) => {
            let response = this.http.post(this.wsUrl, xmlToSend, httpOptions);
        })
    }

    public getShipmentDefaultFormValues(): any {
        return {
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
                                releaseCost: ""
                            }
                        }]
                    },
                    tabSelected: 0,
                    xmlContent: ShipmentBaseTag.Release
                }
            }

        };
    }

    public getNewShipmentByExistent(existentShipment: any): any {

        //ShipmentHeader
        var shipmentHeaderTab = existentShipment.shipmentHeader.tab;

        var shipmentHeaderContent = shipmentHeaderTab.inputContent;

        var shipmentHeaderCarrier = shipmentHeaderContent.shipmentCarrier;

        var shipmentHeaderCost = shipmentHeaderContent.shipmentCost;

        //ShipmentHeader2
        var shipmentHeader2Tab = existentShipment.shipmentHeader2.tab;

        var shipmentHeader2Content = shipmentHeader2Tab.inputContent;

        //ShipmentStop
        var shipmentStopTab = existentShipment.shipmentStop.tab;

        var shipmentStopContent = shipmentStopTab.inputContent;

        //Location
        var shipmentLocationTab = existentShipment.location.tab;

        var shipmentLocationContent = shipmentLocationTab.inputContent;

        //Release
        var shipmentReleaseTab = existentShipment.release.tab;

        var shipmentReleaseContent = shipmentReleaseTab.inputContent;

        var newShipment = {
            shipmentHeader: {
                tab: {
                    inputContent: {
                        emissionStatus: shipmentHeaderContent.emissionStatus,
                        shipmentCarrier: {
                            domainName: shipmentHeaderCarrier.domainName,
                            xid: shipmentHeaderCarrier.xid
                        },
                        shipmentCost: {
                            acessorialCost: shipmentHeaderCost.acessorialCost,
                            baseCost: shipmentHeaderCost.baseCost,
                            totalCost: shipmentHeaderCost.totalCost
                        },
                        shipmentDomainName: shipmentHeaderContent.shipmentDomainName,
                        shipmentRefnums: {
                            Refnums: [{}],
                        },
                        shipmentTaker: shipmentHeaderContent.shipmentTaker,
                        shipmentXid: shipmentHeaderContent.shipmentXid,
                        travelStatus: shipmentHeaderContent.travelStatus
                    },
                    tabSelected: shipmentHeaderTab.tabSelected,
                    xmlContent: shipmentHeaderTab.xmlContent
                }
            },
            shipmentHeader2: {
                tab: {
                    inputContent: {
                        perspective: shipmentHeader2Content.perspective
                    },
                    tabSelected: shipmentHeader2Tab.tabSelected,
                    xmlContent: shipmentHeader2Tab.xmlContent
                }
            },
            shipmentStop: {
                tab: {
                    inputContent: {
                        stops: [{}]
                    },
                    tabSelected: shipmentHeader2Tab.tabSelected,
                    xmlContent: shipmentHeader2Tab.xmlContent
                }
            },
            location: {
                tab: {
                    inputContent: {
                        locations: [{}]
                    },
                    tabSelected: shipmentLocationTab.tabSelected,
                    xmlContent: shipmentLocationTab.xmlContent
                }
            },
            release: {
                tab: {
                    inputContent: {
                        Releases: [{}]
                    },
                    tabSelected: shipmentReleaseTab.tabSelected,
                    xmlContent: shipmentReleaseTab.xmlContent
                }
            }
        };

        /*Colocar listas (refnums, releases)
            location.locations
            release.Releases
        */
        const newShipmentHeaderRefnums = newShipment.shipmentHeader.tab.inputContent.shipmentRefnums.Refnums;

        newShipmentHeaderRefnums.pop();

        shipmentHeaderContent.shipmentRefnums.Refnums.forEach((refnum: any) => {
            newShipmentHeaderRefnums.push({
                domainName: refnum.domainName,
                xid: refnum.xid,
                refnumValue: refnum.refnumValue,
            })
        });

        const newShipmentStops = newShipment.shipmentStop.tab.inputContent.stops;

        newShipmentStops.pop();

        shipmentStopContent.stops.forEach((stop: any) => {
            newShipmentStops.push({
                locationDomainName: stop.locationDomainName,
                locationXid: stop.locationXid,
                stopSequence: stop.stopSequence,
                stopType: stop.stopType,
            })
        });

        const newShipmentLocations = newShipment.location.tab.inputContent.locations;

        newShipmentLocations.pop();

        shipmentLocationContent.locations.forEach((contentLocation: any) => {

            const location = contentLocation.location;

            const newLocation = {
                location: {
                    domainName: location.domainName,
                    xid: location.xid,
                    city: location.city,
                    uf: location.uf,
                    refnums: {
                        Refnums: [{}]
                    }
                }
            };

            const newLocationRefnums = newLocation.location.refnums.Refnums;

            newLocationRefnums.pop();

            location.refnums.Refnums.forEach((refnum: any) => {
                newLocationRefnums.push({
                    domainName: refnum.domainName,
                    xid: refnum.xid,
                    refnumValue: refnum.refnumValue,
                });
            });

            newShipmentLocations.push(newLocation);
        });

        const newShipmentReleases = newShipment.release.tab.inputContent.Releases;

        newShipmentReleases.pop();

        shipmentReleaseContent.Releases.forEach((contentRelease: any) => {

            const release = contentRelease.release;

            const newRelease = {
                release: {
                    releaseDomainName: release.releaseDomainName,
                    releaseXid: release.releaseXid,
                    shipFrom: release.shipFrom,
                    shipTo: release.shipTo,
                    taker: release.taker,
                    orderMovement: {
                        Movements: [{}]
                    },
                    refnums: {
                        Refnums: [{}]
                    },
                    releaseCost: {
                        acessorialCost: [{}],
                        baseCost: "",
                        totalCost: ""
                    }
                }
            };

            const newReleaseOrderMovements = newRelease.release.orderMovement.Movements;

            newReleaseOrderMovements.pop();

            release.orderMovement.Movements.forEach((movement: any) => {
                newReleaseOrderMovements.push({
                    shipFrom: movement.shipFrom,
                    shipTo: movement.shipTo,
                });
            });

            const newReleaseRefnums = newRelease.release.refnums.Refnums;

            newReleaseRefnums.pop();

            if (release.refnums) {
                release.refnums.Refnums.forEach((refnum: any) => {
                    newReleaseRefnums.push({
                        domainName: refnum.domainName,
                        xid: refnum.xid,
                        refnumValue: refnum.refnumValue,
                    });
                });
            }

            const newReleaseCost = newRelease.release.releaseCost;

            newReleaseCost.acessorialCost.pop();

            if (release.releaseCost) {
                const releaseCost = release.release.releaseCost;
                newReleaseCost.baseCost = releaseCost.baseCost;
                newReleaseCost.totalCost = releaseCost.totalCost;
            }

            newShipmentReleases.push(newRelease);
        });

        return newShipment;
    }
}