import { RefnumType } from "./enums/refnumType";
import { CostType } from "./enums/costType";
import { CreationSource } from "./enums/creation-source";
import { ShipmentBaseTag } from "./xml-tags";

export class ShipmentIndex {
    public sendSequenceIndex: number;
    public shipment: Shipment;

    constructor(sequenceSendIndex: number, shipment: Shipment) {
        this.sendSequenceIndex = sequenceSendIndex;
        this.shipment = shipment;
    }
}

export class Shipment {
    public shipmentHeader: ShipmentHeader;
    public shipmentHeader2: ShipmentHeader2;
    public stops: ShipmentStop[];
    public locations: Location[];
    public releases: Release[];

    constructor(shipmentValue: any, source: CreationSource) {

        let shipmentHeaderTab;
        let shipmentHeader2Tab;
        this.stops = [];
        this.locations = [];
        this.releases = [];

        switch (source) {
            case CreationSource.Form:
                shipmentHeaderTab = shipmentValue.shipmentHeader.tab;
                shipmentHeader2Tab = shipmentValue.shipmentHeader2.tab;

                this.createStopsByForm(shipmentValue);

                this.createLocationsByForm(shipmentValue);

                this.createReleasesByForm(shipmentValue);

                break;

            case CreationSource.JSON:
                shipmentHeaderTab = shipmentValue.shipmentHeader;
                shipmentHeader2Tab = shipmentValue.shipmentHeader2;

                this.createStopsByJSON(shipmentValue.stops);

                this.createLocationsByJSON(shipmentValue.locations);

                this.createReleasesByJSON(shipmentValue.releases);

                break;

            default:
                break;
        }

        this.shipmentHeader = new ShipmentHeader(shipmentHeaderTab, source);

        this.shipmentHeader2 = new ShipmentHeader2(shipmentHeader2Tab, source);
    }

    private createReleasesByForm(shipmentValue: any) {
        if (shipmentValue.release.tab.tabSelected === 0) {

            const formReleases = shipmentValue.release.tab.inputContent.Releases;

            formReleases.forEach((formRelease: any) => {

                const release = new Release(formRelease.release, CreationSource.Form);

                this.releases.push(release);

            });
        }
    }

    private createReleasesByJSON(releases: any) {

        releases.forEach((JSONRelease: any) => {

            const release = new Release(JSONRelease, CreationSource.JSON);

            this.releases.push(release);

        });
    }

    private createLocationsByForm(shipmentValue: any) {
        if (shipmentValue.location.tab.tabSelected === 0) {

            const formLocations = shipmentValue.location.tab.inputContent.locations;

            formLocations.forEach((formLocation: any) => {
                const location = new Location(formLocation.location, CreationSource.Form);

                this.locations.push(location);
            });
        }
    }

    private createLocationsByJSON(locations: any) {
        locations.forEach((JSONlocation: any) => {
            const location = new Location(JSONlocation, CreationSource.JSON);

            this.locations.push(location);
        });
    }

    private createStopsByForm(shipmentValue: any) {
        if (shipmentValue.shipmentStop.tab.tabSelected === 0) {

            const formStops = shipmentValue.shipmentStop.tab.inputContent.stops;

            formStops.forEach((formStop: any) => {
                const shipmentStop = new ShipmentStop(formStop.stopSequence,
                    formStop.locationDomainName,
                    formStop.locationXid,
                    formStop.stopType,
                    CreationSource.Form
                );

                this.stops.push(shipmentStop);
            });

        }
    }

    private createStopsByJSON(stops: any) {
        stops.forEach((stop: any) => {
            const shipmentStop = new ShipmentStop(stop.stopSequence,
                stop.locationDomainName,
                stop.locationXid,
                stop.stopType,
                CreationSource.JSON
            );

            this.stops.push(shipmentStop);
        });
    }

    public convertShipmentHeaderToXml(): string {
        if (this.shipmentHeader) {
            return this.shipmentHeader.convertToXml();
        }

        return '';
    }

    public convertShipmentHeader2ToXml(): string {
        if (this.shipmentHeader2) {
            return this.shipmentHeader2.convertToXml();
        }

        return '';
    }

    public convertShipmentStopToXml(): string {
        if (this.stops) {
            let stopXml: string = '';

            this.stops.forEach(stop => {
                stopXml += stop.convertToXml();
            });

            return stopXml;
        }

        return '';
    }

    public convertLocationToXml(): string {
        if (this.locations) {
            let locationXml: string = '';

            this.locations.forEach(location => {
                locationXml += location.convertToXml();
            });

            return locationXml;
        }

        return '';
    }

    public convertReleaseToXmlByShipment(): string {
        if (this.releases) {
            let releaseXml: string = '';

            this.releases.forEach(release => {
                if (release.useShipmentCost)
                    releaseXml += release.convertToXml(this.shipmentHeader.shipmentXid, this.shipmentHeader2.perspective, this.shipmentHeader.carrierXid, this.shipmentHeader.cost);
                else
                    releaseXml += release.convertToXml(this.shipmentHeader.shipmentXid, this.shipmentHeader2.perspective, this.shipmentHeader.carrierXid);
            });

            return releaseXml;
        }

        return '';
    }

    public convertReleaseToXml(shipmentXid: string, perspective: string, carrierXid: string): string {
        if (this.releases) {
            let releaseXml: string = '';

            this.releases.forEach(release => {
                if (release.useShipmentCost)
                    releaseXml += release.convertToXml(shipmentXid, perspective, carrierXid, this.shipmentHeader.cost);
                else
                    releaseXml += release.convertToXml(shipmentXid, perspective, carrierXid);
            });

            return releaseXml;
        }

        return '';
    }

    public static convertShipmentFormToXml(formShipment: any): string {

        const shipment: Shipment = new Shipment(formShipment, CreationSource.Form);

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

        return shipmentXml;
    }

    public static getShipmentFromEntity(shipment: Shipment): any {

        const shipmentHeaderXml = shipment.convertShipmentHeaderToXml();
        const shipmentHeader2Xml = shipment.convertShipmentHeader2ToXml();
        const shipmentStopXml = shipment.convertShipmentStopToXml();
        const shipmentLocationXml = shipment.convertLocationToXml();
        const shipmentReleaseXml = shipment.convertReleaseToXmlByShipment();

        let newFormShipment: any = {
            shipmentHeader: {
                tab: {
                    inputContent: {
                        emissionStatus: shipment.shipmentHeader.emissionStatus,
                        shipmentCarrier: {
                            domainName: shipment.shipmentHeader.carrierDomainName,
                            xid: shipment.shipmentHeader.carrierXid
                        },
                        shipmentCost: {
                            acessorialCost: shipment.shipmentHeader.cost.acessorialCosts,
                            baseCost: shipment.shipmentHeader.cost.baseCost,
                            totalCost: shipment.shipmentHeader.cost.totalCost
                        },
                        shipmentDomainName: shipment.shipmentHeader.shipmentDomainName,
                        shipmentRefnums: {
                            Refnums: [{}],
                        },
                        shipmentTaker: shipment.shipmentHeader.taker,
                        shipmentXid: shipment.shipmentHeader.shipmentXid,
                        travelStatus: shipment.shipmentHeader.travelStatus
                    },
                    tabSelected: 0,
                    xmlContent: shipmentHeaderXml
                }
            },
            shipmentHeader2: {
                tab: {
                    inputContent: {
                        perspective: shipment.shipmentHeader2.perspective
                    },
                    tabSelected: 0,
                    xmlContent: shipmentHeader2Xml
                }
            },
            shipmentStop: {
                tab: {
                    inputContent: {
                        stops: [{}]
                    },
                    tabSelected: 0,
                    xmlContent: shipmentStopXml
                }
            },
            location: {
                tab: {
                    inputContent: {
                        locations: [{}]
                    },
                    tabSelected: 0,
                    xmlContent: shipmentLocationXml
                }
            },
            release: {
                tab: {
                    inputContent: {
                        Releases: [{}]
                    },
                    tabSelected: 0,
                    xmlContent: shipmentReleaseXml
                }
            }
        };

        const newShipmentHeaderRefnums = newFormShipment.shipmentHeader.tab.inputContent.shipmentRefnums.Refnums;

        newShipmentHeaderRefnums.pop();

        shipment.shipmentHeader.refnums.forEach((refnum: Refnum) => {
            newShipmentHeaderRefnums.push({
                domainName: refnum.domainName,
                xid: refnum.xid,
                refnumValue: refnum.refnumValue,
            })
        });

        const newShipmentStops = newFormShipment.shipmentStop.tab.inputContent.stops;

        newShipmentStops.pop();

        shipment.stops.forEach((stop: ShipmentStop) => {
            newShipmentStops.push({
                locationDomainName: stop.locationDomainName,
                locationXid: stop.locationXid,
                stopSequence: stop.stopSequence,
                stopType: stop.stopType,
            })
        });

        const newShipmentLocations = newFormShipment.location.tab.inputContent.locations;

        newShipmentLocations.pop();

        shipment.locations.forEach((location: Location) => {

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

            location.refnums.forEach((refnum: Refnum) => {
                newLocationRefnums.push({
                    domainName: refnum.domainName,
                    xid: refnum.xid,
                    refnumValue: refnum.refnumValue,
                });
            });

            newShipmentLocations.push(newLocation);
        });

        const newShipmentReleases = newFormShipment.release.tab.inputContent.Releases;

        newShipmentReleases.pop();

        shipment.releases.forEach((release: Release) => {

            const newRelease = {
                release: {
                    releaseDomainName: release.domainName,
                    releaseXid: release.xid,
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

            release.orderMovements.forEach((movement: OrderMovement) => {
                newReleaseOrderMovements.push({
                    shipFrom: movement.shipFrom,
                    shipTo: movement.shipTo,
                });
            });

            const newReleaseRefnums = newRelease.release.refnums.Refnums;

            newReleaseRefnums.pop();

            if (release.refnums) {
                release.refnums.forEach((refnum: Refnum) => {
                    newReleaseRefnums.push({
                        domainName: refnum.domainName,
                        xid: refnum.xid,
                        refnumValue: refnum.refnumValue,
                    });
                });
            }

            const newReleaseCost = newRelease.release.releaseCost;

            newReleaseCost.acessorialCost.pop();

            if (release.cost) {
                const releaseCost = release.cost;
                newReleaseCost.baseCost = releaseCost.baseCost;
                newReleaseCost.totalCost = releaseCost.totalCost;
            }

            newShipmentReleases.push(newRelease);
        });

        return newFormShipment;
    }

    public static getShipmentDefaultFormValues(): any {
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
                                    refnumValue: "S"
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

    public static getNewShipmentByExistent(existentShipment: any): any {

        //ShipmentHeader
        const shipmentHeaderTab = existentShipment.shipmentHeader.tab;

        const shipmentHeaderContent = shipmentHeaderTab.inputContent;

        const shipmentHeaderCarrier = shipmentHeaderContent.shipmentCarrier;

        const shipmentHeaderCost = shipmentHeaderContent.shipmentCost;

        //ShipmentHeader2
        const shipmentHeader2Tab = existentShipment.shipmentHeader2.tab;

        const shipmentHeader2Content = shipmentHeader2Tab.inputContent;

        //ShipmentStop
        const shipmentStopTab = existentShipment.shipmentStop.tab;

        const shipmentStopContent = shipmentStopTab.inputContent;

        //Location
        const shipmentLocationTab = existentShipment.location.tab;

        const shipmentLocationContent = shipmentLocationTab.inputContent;

        //Release
        const shipmentReleaseTab = existentShipment.release.tab;

        const shipmentReleaseContent = shipmentReleaseTab.inputContent;

        const newShipment = {
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

            const newRelease = Release.getNewReleaseConsideringCost(release);

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

            newShipmentReleases.push(newRelease);
        });

        return newShipment;
    }
}

export class ShipmentHeader {
    public shipmentDomainName: string = "EMBDEV";
    public shipmentXid: string = "XID";
    public travelStatus: string = "PLANEJADO";
    public emissionStatus: string = "PRE_EMISSAO_PLANEJADA";
    public taker: string = "XID_TOMADOR";
    public carrierDomainName: string = "EMBDEV";
    public carrierXid: string = 'XID_TRANSPORTADOR';
    public refnums: Refnum[] = [];
    public cost: Cost = new Cost(null, CreationSource.Form);

    constructor(content: any, source: CreationSource) {

        switch (source) {
            case CreationSource.Form:

                if (content.tabSelected === 0) {
                    const inputContent = content.inputContent;

                    this.shipmentDomainName = inputContent.shipmentDomainName;
                    this.shipmentXid = inputContent.shipmentXid;
                    this.travelStatus = inputContent.travelStatus;
                    this.emissionStatus = inputContent.emissionStatus;
                    this.taker = inputContent.shipmentTaker;

                    const shipmentCarrier = inputContent.shipmentCarrier;
                    this.carrierDomainName = shipmentCarrier.domainName;
                    this.carrierXid = shipmentCarrier.xid;

                    if (inputContent.shipmentRefnums)
                        this.refnums = inputContent.shipmentRefnums.Refnums as Refnum[];

                    this.cost = new Cost(inputContent.shipmentCost, source);
                }

                break;

            case CreationSource.JSON:
                this.shipmentDomainName = content.shipmentDomainName;
                this.shipmentXid = content.shipmentXid;
                this.travelStatus = content.travelStatus;
                this.emissionStatus = content.emissionStatus;
                this.taker = content.taker;
                this.carrierDomainName = content.carrierDomainName;
                this.carrierXid = content.carrierXid;

                if (content.refnums) {
                    this.refnums = content.refnums as Refnum[];
                }

                this.cost = new Cost(content.cost, source)

                break;

            default:
                break;
        }
    }

    public convertToXml(): string {
        let xml = `<otm:ShipmentHeader>
    <otm:ShipmentGid>
        <otm:Gid>
            <otm:DomainName>[[DomainName]]</otm:DomainName>
            <otm:Xid>[[Xid]]</otm:Xid>
        </otm:Gid>
    </otm:ShipmentGid>
    [[Refnums]]
    <otm:InternalShipmentStatus>
        <otm:StatusTypeGid>
            <otm:Gid>
                <otm:DomainName>[[DomainName]]</otm:DomainName>
                <otm:Xid>CLL_STATUS_VIAGEM</otm:Xid>
            </otm:Gid>
        </otm:StatusTypeGid>
        <otm:StatusValueGid>
            <otm:Gid>
                <otm:DomainName>[[DomainName]]</otm:DomainName>
                <otm:Xid>[[TravelStatus]]</otm:Xid>
            </otm:Gid>
        </otm:StatusValueGid>
    </otm:InternalShipmentStatus>
    <otm:InternalShipmentStatus>
        <otm:StatusTypeGid>
            <otm:Gid>
                <otm:DomainName>[[DomainName]]</otm:DomainName>
                <otm:Xid>CLL_STATUS_EMISSAO</otm:Xid>
            </otm:Gid>
        </otm:StatusTypeGid>
        <otm:StatusValueGid>
            <otm:Gid>
                <otm:DomainName>[[DomainName]]</otm:DomainName>
                <otm:Xid>[[EmissionStatus]]</otm:Xid>
            </otm:Gid>
        </otm:StatusValueGid>
    </otm:InternalShipmentStatus>
    <otm:ServiceProviderGid>
        <otm:Gid>
            <otm:DomainName>[[CarrierDomainName]]</otm:DomainName>
            <otm:Xid>[[CarrierXid]]</otm:Xid>
        </otm:Gid>
    </otm:ServiceProviderGid>
    [[ShipmentCost]]
    <otm:TransportModeGid>
        <otm:Gid>
            <otm:Xid>TL</otm:Xid>
        </otm:Gid>
    </otm:TransportModeGid>
    <otm:InvolvedParty>
        <otm:InvolvedPartyQualifierGid>
            <otm:Gid>
                <otm:DomainName>[[DomainName]]</otm:DomainName>
                <otm:Xid>CLL_TOMADOR</otm:Xid>
            </otm:Gid>
        </otm:InvolvedPartyQualifierGid>
        <otm:InvolvedPartyLocationRef>
            <otm:LocationRef>
                <otm:LocationGid>
                    <otm:Gid>
                        <otm:DomainName>[[DomainName]]</otm:DomainName>
                        <otm:Xid>[[Taker]]</otm:Xid>
                    </otm:Gid>
                </otm:LocationGid>
            </otm:LocationRef>
        </otm:InvolvedPartyLocationRef>
    </otm:InvolvedParty>
</otm:ShipmentHeader>`;

        const refnums: string = Refnum.getRefnumsXmlByType(this.refnums, RefnumType.Shipment);

        return xml.replaceAll('[[DomainName]]', this.shipmentDomainName)
            .replaceAll('[[Xid]]', this.shipmentXid)
            .replaceAll('[[Refnums]]', refnums)
            .replaceAll('[[TravelStatus]]', this.travelStatus)
            .replaceAll('[[EmissionStatus]]', this.emissionStatus)
            .replaceAll('[[CarrierDomainName]]', this.carrierDomainName)
            .replaceAll('[[CarrierXid]]', this.carrierXid)
            .replaceAll('[[Taker]]', this.taker)
            .replaceAll('[[ShipmentCost]]', this.cost.convertToXml(CostType.Shipment, this.shipmentDomainName));
    }

    public static getShipmentXidFromXml(xml: string): string {
        const shipmentGid = xml.slice(
            xml.indexOf('otm:ShipmentGid'),
            xml.indexOf('/otm:ShipmentGid')
        );

        return shipmentGid
            .slice(
                shipmentGid.indexOf('<otm:Xid>') + '<otm:Xid>'.length,
                shipmentGid.indexOf('</otm:Xid>')
            );
    }

    public static getTravelStatusFromXml(xml: string): string {
        const statusViagemTag = xml.slice(
            xml.indexOf('CLL_STATUS_VIAGEM'),
            xml.lastIndexOf('</otm:StatusValueGid>')
        )

        const statusViagemValue = statusViagemTag.slice(
            statusViagemTag.indexOf('<otm:StatusValueGid>'),
            statusViagemTag.lastIndexOf('</otm:Gid>')
        );

        return statusViagemValue
            .slice(
                statusViagemValue.indexOf('<otm:Xid>') + '<otm:Xid>'.length,
                statusViagemValue.indexOf('</otm:Xid>')
            );
    }

    public static getCarrierXidFromXml(xml: string): string {
        const shipmentGid = xml.slice(
            xml.indexOf('otm:ServiceProviderGid'),
            xml.indexOf('/otm:ServiceProviderGid')
        );

        return shipmentGid
            .slice(
                shipmentGid.indexOf('<otm:Xid>') + '<otm:Xid>'.length,
                shipmentGid.indexOf('</otm:Xid>')
            );
    }
}

export class ShipmentHeader2 {
    public perspective: string = "Buy";

    constructor(content: any, source: CreationSource) {

        switch (source) {
            case CreationSource.Form:

                if (content.tabSelected === 0) {
                    this.perspective = content.inputContent.perspective;
                }

                break;

            case CreationSource.JSON:

                this.perspective = content.perspective;

                break;

            default:
                break;
        }

    }

    public convertToXml(): string {
        let xml = `<otm:ShipmentHeader2>
    <otm:Perspective>[[Perspective]]</otm:Perspective>
</otm:ShipmentHeader2>`;

        return xml.replaceAll('[[Perspective]]', (this.perspective === "Buy") ? 'B' : 'S');
    }

    public static getPerspectiveFromXml(xml: string): string {
        return xml
            .slice(
                xml.indexOf('<otm:Perspective>') + '<otm:Perspective>'.length,
                xml.indexOf('</otm:Perspective>')
            );
    }
}

export class ShipmentStop {
    public stopSequence: string = "1";
    public locationDomainName: string = "EMBDEV";
    public locationXid: string = "XID";
    public stopType: string = "P";

    constructor(stopSequence: string, locationDomainName: string, locationXid: string, stopType: string, source: CreationSource) {

        switch (source) {
            case CreationSource.Form:
            case CreationSource.JSON:

                this.stopSequence = stopSequence;
                this.locationDomainName = locationDomainName;
                this.locationXid = locationXid;
                this.stopType = stopType;

                break;

            default:
                break;
        }
    }

    public convertToXml(): string {
        let xml = `<otm:ShipmentStop>
    <otm:StopSequence>[[StopSequence]]</otm:StopSequence>
    <otm:LocationRef>
        <otm:LocationGid>
            <otm:Gid>
                <otm:DomainName>[[LocationDomainName]]</otm:DomainName>
                <otm:Xid>[[LocationXid]]</otm:Xid>
            </otm:Gid>
        </otm:LocationGid>
    </otm:LocationRef>
    <otm:StopType>[[StopType]]</otm:StopType>
</otm:ShipmentStop>`;

        let stopType: string;

        switch (this.stopType) {
            case "Coleta":
                stopType = 'P';

                break;

            case "Entrega":
                stopType = 'D';

                break;
            default:
                stopType = 'PD'
                break;
        }

        return xml.replaceAll('[[StopSequence]]', this.stopSequence)
            .replaceAll('[[LocationDomainName]]', this.locationDomainName)
            .replaceAll('[[LocationXid]]', this.locationXid)
            .replaceAll('[[StopType]]', stopType);
    }
}

export class Location {
    public domainName: string = "EMBDEV";
    public xid: string = "XID";
    public city: string = "LAGES";
    public uf: string = "SC";
    public refnums: Refnum[] = [];

    constructor(location: any, source: CreationSource) {

        this.domainName = location.domainName;
        this.xid = location.xid;
        this.city = location.city;
        this.uf = location.uf;

        switch (source) {
            case CreationSource.Form:

                this.refnums = location.refnums.Refnums as Refnum[];

                break;

            case CreationSource.JSON:

                this.refnums = location.refnums as Refnum[];

                break;

            default:
                break;
        }
    }

    public convertToXml(): string {
        let xml = `<otm:Location>
    <otm:LocationGid>
        <otm:Gid>
            <otm:DomainName>[[DomainName]]</otm:DomainName>
            <otm:Xid>[[Xid]]</otm:Xid>
        </otm:Gid>
    </otm:LocationGid>
    <otm:LocationName>[[Xid]]</otm:LocationName>
    <otm:Address>
        <otm:AddressLines>
            <otm:SequenceNumber>1</otm:SequenceNumber>
            <otm:AddressLine>ROD BR-262 SN KM 7.5</otm:AddressLine>
        </otm:AddressLines>
        <otm:City>[[City]]</otm:City>
        <otm:ProvinceCode>[[Uf]]</otm:ProvinceCode>
        <otm:PostalCode>29136350</otm:PostalCode>
        <otm:CountryCode3Gid>
            <otm:Gid>
                <otm:Xid>BR</otm:Xid>
            </otm:Gid>
        </otm:CountryCode3Gid>
    </otm:Address>
    [[Refnums]]
</otm:Location>`;

        const refnums = Refnum.getRefnumsXmlByType(this.refnums, RefnumType.Location);

        return xml.replaceAll('[[DomainName]]', this.domainName)
            .replaceAll('[[Xid]]', this.xid)
            .replaceAll('[[City]]', this.city)
            .replaceAll('[[Uf]]', this.uf)
            .replaceAll('[[Refnums]]', refnums);
    }
}

export class Release {
    public domainName: string = "EMBDEV";
    public xid: string = "XID";
    public shipFrom: string = "XID_ORIGEM";
    public shipTo: string = "XID_DESTINO";
    public refnums: Refnum[] = [];
    public orderMovements: OrderMovement[] = [];
    public taker: string = "XID_TOMADOR";
    public cost: Cost = new Cost('', CreationSource.Form);
    public useShipmentCost: boolean = false;

    constructor(release: any, source: CreationSource) {

        this.shipFrom = release.shipFrom;
        this.shipTo = release.shipTo;
        this.taker = release.taker;

        this.orderMovements = [];

        switch (source) {
            case CreationSource.Form:

                this.domainName = release.releaseDomainName;
                this.xid = release.releaseXid;

                this.refnums = release.refnums.Refnums as Refnum[];

                if (release.releaseCost) {
                    this.cost = new Cost(release.releaseCost, source);
                } else {
                    this.useShipmentCost = true;
                }

                this.createOrderMovementsByForm(release);

                break;

            case CreationSource.JSON:

                this.domainName = release.domainName;
                this.xid = release.xid;

                this.refnums = release.refnums as Refnum[];

                this.useShipmentCost = release.useShipmentCost;

                this.cost = new Cost(release.cost, source);

                this.createOrderMovementsByJSON(release.orderMovements);

                break;

            default:
                break;
        }
    }

    private createOrderMovementsByForm(formRelease: any) {
        for (let index = 0; index < formRelease.orderMovement.Movements.length; index++) {
            const formOrderMovement = formRelease.orderMovement.Movements[index];

            const orderMovement = new OrderMovement(formOrderMovement.shipFrom, formOrderMovement.shipTo);

            this.orderMovements.push(orderMovement);
        }
    }

    private createOrderMovementsByJSON(orderMovements: any) {
        for (let index = 0; index < orderMovements.length; index++) {
            const jsonOrderMovement = orderMovements[index];

            const orderMovement = new OrderMovement(jsonOrderMovement.shipFrom, jsonOrderMovement.shipTo);

            this.orderMovements.push(orderMovement);
        }
    }

    public convertToXml(shipmentXid: string, perspective: string, carrierXid: string, shipmentCost: Cost | null = null): string {
        let xml = `<otm:Release>
    <otm:ReleaseGid>
        <otm:Gid>
            <otm:DomainName>[[DomainName]]</otm:DomainName>
            <otm:Xid>[[Xid]]</otm:Xid>
        </otm:Gid>
    </otm:ReleaseGid>
    <otm:ShipFromLocationRef>
        <otm:LocationRef>
            <otm:LocationGid>
                <otm:Gid>
                    <otm:DomainName>[[DomainName]]</otm:DomainName>
                    <otm:Xid>[[ShipFrom]]</otm:Xid>
                </otm:Gid>
            </otm:LocationGid>
        </otm:LocationRef>
    </otm:ShipFromLocationRef>
    <otm:ShipToLocationRef>
        <otm:LocationRef>
            <otm:LocationGid>
                <otm:Gid>
                    <otm:DomainName>[[DomainName]]</otm:DomainName>
                    <otm:Xid>[[ShipTo]]</otm:Xid>
                </otm:Gid>
            </otm:LocationGid>
        </otm:LocationRef>
    </otm:ShipToLocationRef>
    [[ReleaseCost]]
    [[OrderMovement]]
    [[Refnums]]
    <otm:InvolvedParty>
        <otm:InvolvedPartyQualifierGid>
            <otm:Gid>
                <otm:DomainName>[[DomainName]]</otm:DomainName>
                <otm:Xid>CLL_TOMADOR</otm:Xid>
            </otm:Gid>
        </otm:InvolvedPartyQualifierGid>
        <otm:InvolvedPartyLocationRef>
            <otm:LocationRef>
                <otm:LocationGid>
                    <otm:Gid>
                        <otm:DomainName>[[DomainName]]</otm:DomainName>
                        <otm:Xid>[[Taker]]</otm:Xid>
                    </otm:Gid>
                </otm:LocationGid>
            </otm:LocationRef>
        </otm:InvolvedPartyLocationRef>
    </otm:InvolvedParty>
</otm:Release>`;

        const refnums = (this.refnums) ? Refnum.getRefnumsXmlByType(this.refnums, RefnumType.Release) : '';

        let orderMovementXml: string = '';

        for (let index = 0; index < this.orderMovements.length; index++) {

            const orderMovement = this.orderMovements[index];

            orderMovementXml += orderMovement.convertToXml(this.domainName, this.xid, perspective, shipmentXid, carrierXid);
        }

        let cost: string;

        if (shipmentCost)
            cost = this.cost.convertToXml(CostType.Release, this.domainName, shipmentXid, shipmentCost);
        else
            cost = this.cost.convertToXml(CostType.Release, this.domainName, shipmentXid);


        return xml.replaceAll('[[DomainName]]', this.domainName)
            .replaceAll('[[Xid]]', this.xid)
            .replaceAll('[[ShipFrom]]', this.shipFrom)
            .replaceAll('[[ShipTo]]', this.shipTo)
            .replaceAll('[[ShipmentXid]]', shipmentXid)
            .replaceAll('[[OrderMovement]]', orderMovementXml)
            .replaceAll('[[Taker]]', this.taker)
            .replaceAll('[[Refnums]]', refnums)
            .replaceAll('[[ReleaseCost]]', cost);
    }

    public static getNewReleaseConsideringCost(release: any): any {

        if (!release.releaseCost) {
            return {
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
                    releaseCost: ""
                }
            }
        }

        const releaseWithCost = {
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

        const newReleaseCost = releaseWithCost.release.releaseCost;

        newReleaseCost.acessorialCost.pop();

        if (release.releaseCost) {
            const releaseCost = release.releaseCost;
            newReleaseCost.baseCost = releaseCost.baseCost;
            newReleaseCost.acessorialCost = releaseCost.acessorialCost;
            newReleaseCost.totalCost = releaseCost.totalCost;
        }

        return releaseWithCost;
    }
}

export class OrderMovement {
    public shipFrom: string = "XID_ORIGEM";
    public shipTo: string = "XID_DESTINO";

    constructor(shipFrom: string, shipTo: string) {
        this.shipFrom = shipFrom;
        this.shipTo = shipTo;
    }

    public convertToXml(domainName: string, releaseXid: string,
        perspective: string, shipmentXid: string, carrierXid: string): string {

        let xml = `<otm:OrderMovement>
    <otm:OrderMovementGid>
        <otm:Gid>
            <otm:DomainName>[[DomainName]]</otm:DomainName>
            <otm:Xid>OMOVEMENT1</otm:Xid>
        </otm:Gid>
    </otm:OrderMovementGid>
    <otm:OrderReleaseGid>
        <otm:Gid>
            <otm:DomainName>[[DomainName]]</otm:DomainName>
            <otm:Xid>[[ReleaseXid]]</otm:Xid>
        </otm:Gid>
    </otm:OrderReleaseGid>
    <otm:Perspective>[[ShipmentPerspective]]</otm:Perspective>
    <otm:ShipFromLocationRef>
        <otm:LocationRef>
            <otm:Location>
                <otm:LocationGid>
                    <otm:Gid>
                        <otm:DomainName>[[DomainName]]</otm:DomainName>
                        <otm:Xid>[[ShipFrom]]</otm:Xid>
                    </otm:Gid>
                </otm:LocationGid>
            </otm:Location>
        </otm:LocationRef>
    </otm:ShipFromLocationRef>
    <otm:ShipToLocationRef>
        <otm:LocationRef>
            <otm:Location>
                <otm:LocationGid>
                    <otm:Gid>
                        <otm:DomainName>[[DomainName]]</otm:DomainName>
                        <otm:Xid>[[ShipTo]]</otm:Xid>
                    </otm:Gid>
                </otm:LocationGid>
            </otm:Location>
        </otm:LocationRef>
    </otm:ShipToLocationRef>
    <otm:ShipmentGid>
        <otm:Gid>
            <otm:DomainName>[[DomainName]]</otm:DomainName>
            <otm:Xid>[[ShipmentXid]]</otm:Xid>
        </otm:Gid>
    </otm:ShipmentGid>
    <otm:ServiceProviderGid>
        <otm:Gid>
            <otm:DomainName>[[DomainName]]</otm:DomainName>
            <otm:Xid>[[CarrierXid]]</otm:Xid>
        </otm:Gid>
    </otm:ServiceProviderGid>
</otm:OrderMovement>`;

        perspective = perspective == "Buy" ? "B" : "S";

        return xml.replaceAll('[[DomainName]]', domainName)
            .replaceAll('[[ReleaseXid]]', releaseXid)
            .replaceAll('[[ShipmentPerspective]]', perspective)
            .replaceAll('[[ShipFrom]]', this.shipFrom)
            .replaceAll('[[ShipTo]]', this.shipTo)
            .replaceAll('[[ShipmentXid]]', shipmentXid)
            .replaceAll('[[CarrierXid]]', carrierXid);
    }
}

export class Refnum {
    public domainName: string = 'EMBDEV';
    public xid: string = 'XID';
    public refnumValue: string = 'CLL';

    public static getRefnumsXmlByType(refnums: Refnum[], refnumType: RefnumType): string {

        let finalRefnumXml: string = '';

        refnums.forEach(refnum => {
            let refnumXml: string = '';

            switch (refnumType) {
                case RefnumType.Shipment:
                    refnumXml = `<otm:ShipmentRefnum>
        <otm:ShipmentRefnumQualifierGid>
            <otm:Gid>
                <otm:DomainName>[[DomainName]]</otm:DomainName>
                <otm:Xid>[[Xid]]</otm:Xid>
            </otm:Gid>
        </otm:ShipmentRefnumQualifierGid>
        <otm:ShipmentRefnumValue>[[Value]]</otm:ShipmentRefnumValue>
    </otm:ShipmentRefnum>`;

                    break;

                case RefnumType.Location:
                    refnumXml = `<otm:LocationRefnum>
        <otm:LocationRefnumQualifierGid>
            <otm:Gid>
                <otm:DomainName>[[DomainName]]</otm:DomainName>
                <otm:Xid>[[Xid]]</otm:Xid>
            </otm:Gid>
        </otm:LocationRefnumQualifierGid>
        <otm:LocationRefnumValue>[[Value]]</otm:LocationRefnumValue>
    </otm:LocationRefnum>`;

                    break;

                case RefnumType.Release:
                    refnumXml = `<otm:ReleaseRefnum>
    <otm:ReleaseRefnumQualifierGid>
        <otm:Gid>
            <otm:DomainName>[[DomainName]]</otm:DomainName>
            <otm:Xid>[[Xid]]</otm:Xid>
        </otm:Gid>
    </otm:ReleaseRefnumQualifierGid>
    <otm:ReleaseRefnumValue>[[Value]]</otm:ReleaseRefnumValue>
</otm:ReleaseRefnum>`;

                    break;
                default:
                    return;
            }

            finalRefnumXml += refnumXml.replaceAll('[[DomainName]]', refnum.domainName)
                .replaceAll('[[Xid]]', refnum.xid)
                .replaceAll('[[Value]]', refnum.refnumValue)
        });

        return finalRefnumXml;
    }
}

export class Cost {
    public baseCost: string = "100.00";
    public acessorialCosts: AcessorialCost[] = [];
    public totalCost: string = "100.00";

    constructor(cost: any, source: CreationSource) {
        if (cost) {

            this.baseCost = cost.baseCost;

            this.totalCost = cost.totalCost;

            switch (source) {
                case CreationSource.Form:

                    if (cost.acessorialCost) {

                        if (typeof (cost.acessorialCost) === "object" && cost.acessorialCost.length === 0) return;

                        for (let index = 0; index < cost.acessorialCost.costs.length; index++) {
                            const formAcessorialCost = cost.acessorialCost.costs[index];

                            const acessorialCost: AcessorialCost = new AcessorialCost(formAcessorialCost.xid, formAcessorialCost.costValue);

                            this.acessorialCosts.push(acessorialCost);
                        }
                    }

                    break;

                case CreationSource.JSON:

                    if (cost.acessorialCosts) {

                        if (typeof (cost.acessorialCosts) === "object" && cost.acessorialCosts.length === 0) return;

                        for (let index = 0; index < cost.acessorialCosts.length; index++) {
                            const jsonAcessorialCost = cost.acessorialCosts[index];

                            const acessorialCost: AcessorialCost = new AcessorialCost(jsonAcessorialCost.costXid, jsonAcessorialCost.costValue);

                            this.acessorialCosts.push(acessorialCost);
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    }

    public convertToXml(costType: CostType, shipmentDomainName: string, shipmentXid: string = '', shipmentCost: Cost | null = null) {

        let xml: string = '';

        switch (costType) {
            case CostType.Shipment:
                xml = `<otm:TotalPlannedCost>
        <otm:FinancialAmount>
            <otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode>
            <otm:MonetaryAmount>[[TotalCost]]</otm:MonetaryAmount>
        </otm:FinancialAmount>
    </otm:TotalPlannedCost>
    <otm:TotalActualCost>
        <otm:FinancialAmount>
            <otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode>
            <otm:MonetaryAmount>[[TotalCost]]</otm:MonetaryAmount>
        </otm:FinancialAmount>
    </otm:TotalActualCost>
    <otm:TotalWeightedCost>
        <otm:FinancialAmount>
            <otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode>
            <otm:MonetaryAmount>[[TotalCost]]</otm:MonetaryAmount>
        </otm:FinancialAmount>
    </otm:TotalWeightedCost>
    <otm:ShipmentCost>
        <otm:ShipmentCostSeqno>1</otm:ShipmentCostSeqno>
        <otm:CostType>B</otm:CostType>
        <otm:Cost>
            <otm:FinancialAmount>
                <otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode>
                <otm:MonetaryAmount>[[BaseCost]]</otm:MonetaryAmount>
            </otm:FinancialAmount>
        </otm:Cost>
    </otm:ShipmentCost>
    [[AccessorialCost]]`;

                break;

            case CostType.Release:
                xml = `<otm:ReleaseAllocationInfo>
    <otm:ReleaseAllocByType>
        <otm:AllocTypeQualGid>
            <otm:Gid>
                <otm:Xid>PLANNING</otm:Xid>
            </otm:Gid>
        </otm:AllocTypeQualGid>
            <otm:ReleaseAllocShipment>
            <otm:ShipmentGid>
                <otm:Gid>
                    <otm:DomainName>[[DomainName]]</otm:DomainName>
                    <otm:Xid>[[ShipmentXid]]</otm:Xid>
                </otm:Gid>
            </otm:ShipmentGid>
            <otm:TotalAllocCost>
                <otm:FinancialAmount>
                    <otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode>
                    <otm:MonetaryAmount>[[TotalCost]]</otm:MonetaryAmount>
                    <otm:RateToBase>0.5639521768554027</otm:RateToBase>
                    <otm:FuncCurrencyAmount>0.0</otm:FuncCurrencyAmount>
                </otm:FinancialAmount>
            </otm:TotalAllocCost>
            <otm:ReleaseAllocShipmentDetail>
                <otm:Cost>
                    <otm:FinancialAmount>
                        <otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode>
                        <otm:MonetaryAmount>[[BaseCost]]</otm:MonetaryAmount>
                        <otm:RateToBase>0.5639521768554027</otm:RateToBase>
                        <otm:FuncCurrencyAmount>0.0</otm:FuncCurrencyAmount>
                    </otm:FinancialAmount>
                </otm:Cost>
                <otm:CostTypeGid>
                    <otm:Gid>
                        <otm:Xid>B</otm:Xid>
                    </otm:Gid>
                </otm:CostTypeGid>
                <otm:CostDescription>B</otm:CostDescription>
            </otm:ReleaseAllocShipmentDetail>
        </otm:ReleaseAllocShipment>
        [[AccessorialCost]] 
    </otm:ReleaseAllocByType>
</otm:ReleaseAllocationInfo>`;

                break;

            default:
                break;
        }

        let baseCost: string;
        let totalCost: string;
        let accessorialCost: string;

        if (shipmentCost) {
            baseCost = shipmentCost.baseCost;
            totalCost = shipmentCost.totalCost;
            accessorialCost = AcessorialCost.getAccessorialXmlByType(shipmentCost.acessorialCosts, costType, shipmentDomainName);
        } else {
            baseCost = this.baseCost;
            totalCost = this.totalCost;
            accessorialCost = AcessorialCost.getAccessorialXmlByType(this.acessorialCosts, costType, shipmentDomainName);
        }

        return xml.replaceAll('[[TotalCost]]', totalCost)
            .replaceAll('[[BaseCost]]', baseCost)
            .replaceAll('[[AccessorialCost]]', accessorialCost)
            .replaceAll('[[DomainName]]', shipmentDomainName)
            .replaceAll('[[ShipmentXid]]', shipmentXid);
    }
}

export class AcessorialCost {
    public costXid: string = "DIARIA";
    public costValue: string = "50.00";

    constructor(costXid: string, costValue: string) {
        this.costXid = costXid;
        this.costValue = costValue;
    }

    public static getAccessorialXmlByType(costs: AcessorialCost[], costType: CostType, shipmentDomainName: string): string {

        let finalCostXml: string = '';

        costs.forEach(cost => {
            let costXml: string = '';

            switch (costType) {
                case CostType.Shipment:
                    costXml = `<otm:ShipmentCost>
    <otm:ShipmentCostSeqno>465001</otm:ShipmentCostSeqno>
    <otm:CostType>A</otm:CostType>
    <otm:Cost>
        <otm:FinancialAmount>
            <otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode>
            <otm:MonetaryAmount>[[CostValue]]</otm:MonetaryAmount>
        </otm:FinancialAmount>
    </otm:Cost>
    <otm:AccessorialCodeGid>
        <otm:Gid>
            <otm:DomainName>[[DomainName]]</otm:DomainName>
            <otm:Xid>[[CostXid]]</otm:Xid>
        </otm:Gid>
    </otm:AccessorialCodeGid>
</otm:ShipmentCost>`;

                    break;

                case CostType.Release:
                    costXml = `<otm:ReleaseAllocShipmentDetail>
                <otm:AllocSeqNo>79997</otm:AllocSeqNo>
                <otm:AllocCostSeqno>8</otm:AllocCostSeqno>
                <otm:Cost>
                    <otm:FinancialAmount>
                        <otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode>
                        <otm:MonetaryAmount>[[CostValue]]</otm:MonetaryAmount>
                        <otm:RateToBase>0.5639521768554027</otm:RateToBase>
                        <otm:FuncCurrencyAmount>0.0</otm:FuncCurrencyAmount>
                    </otm:FinancialAmount>
                </otm:Cost>
                <otm:CostTypeGid>
                    <otm:Gid>
                        <otm:Xid>A</otm:Xid>
                    </otm:Gid>
                </otm:CostTypeGid>
                <otm:AccessorialCodeGid>
                    <otm:Gid>
                        <otm:DomainName>[[DomainName]]</otm:DomainName>
                        <otm:Xid>[[CostXid]]</otm:Xid>
                    </otm:Gid>
                </otm:AccessorialCodeGid>
                <otm:FlexFieldStrings />
                <otm:FlexFieldNumbers />
                <otm:FlexFieldDates />
            </otm:ReleaseAllocShipmentDetail>`;

                    break;
                default:
                    return;
            }

            finalCostXml += costXml.replaceAll('[[CostValue]]', cost.costValue)
                .replaceAll('[[DomainName]]', shipmentDomainName)
                .replaceAll('[[CostXid]]', cost.costXid);
        });

        return finalCostXml;
    }
}