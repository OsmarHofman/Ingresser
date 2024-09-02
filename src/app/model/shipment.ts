import { FormGroup } from "@angular/forms";
import { RefnumType } from "./refnumType";

export class Shipment {
    public shipmentHeader: ShipmentHeader;
    public shipmentHeader2: ShipmentHeader2;
    public stops: ShipmentStop[];
    public locations: Location[];
    public releases: Release[];
    public cost: Cost;

    constructor(form: FormGroup) {

        const shipmentHeaderTab = form.controls['shipmentHeader'].value.tab;

        this.shipmentHeader = new ShipmentHeader(shipmentHeaderTab);

        const shipmentHeader2Tab = form.controls['shipmentHeader2'].value.tab;

        this.shipmentHeader2 = new ShipmentHeader2(shipmentHeader2Tab);

        this.stops = [];

        if (form.controls['shipmentStop'].value.tab.tabSelected === 0) {

            const formStops = form.controls['shipmentStop'].value.tab.inputContent.stops;

            for (let index = 0; index < formStops.length; index++) {
                const formStop = formStops[index];

                const shipmentStop = new ShipmentStop(formStop.stopSequence, formStop.locationDomainName, formStop.locationXid, formStop.stopType);

                this.stops.push(shipmentStop);
            }

        }

        this.locations = [];

        if (form.controls['location'].value.tab.tabSelected === 0) {

            const formLocations = form.controls['location'].value.tab.inputContent.Locations;

            for (let index = 0; index < formLocations.length; index++) {
                const location = new Location(formLocations[index].location);

                this.locations.push(location);
            }

        }

        this.releases = [];

        if (form.controls['release'].value.tab.tabSelected === 0) {

            const formReleases = form.controls['release'].value.tab.inputContent.Releases;

            for (let index = 0; index < formReleases.length; index++) {
                const release = new Release(formReleases[index].release);

                this.releases.push(release);
            }

        }

        const costTab = form.controls['cost'].value.tab;

        this.cost = new Cost(costTab);
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

    constructor(tabFormContent: any) {
        if (tabFormContent.tabSelected === 0) {
            const inputContent = tabFormContent.inputContent;

            this.shipmentDomainName = inputContent.shipmentDomainName;
            this.shipmentXid = inputContent.shipmentXid;
            this.travelStatus = inputContent.travelStatus;
            this.emissionStatus = inputContent.emissionStatus;
            this.taker = inputContent.shipmentTaker;

            const shipmentCarrier = inputContent.shipmentCarrier;
            this.carrierDomainName = shipmentCarrier.domainName;
            this.carrierXid = shipmentCarrier.xid;

            this.refnums = inputContent.shipmentRefnums.Refnums as Refnum[];
        }
    }

    public convertToXml(): string {
        let xml = `<ShipmentHeader>
    <ShipmentGid>
        <Gid>
            <DomainName>[[DomainName]]</DomainName>
            <Xid>[[Xid]]</Xid>
        </Gid>
    </ShipmentGid>
    [[Refnums]]
    <InternalShipmentStatus>
        <StatusTypeGid>
            <Gid>
                <DomainName>[[DomainName]]</DomainName>
                <Xid>CLL_STATUS_VIAGEM</Xid>
            </Gid>
        </StatusTypeGid>
        <StatusValueGid>
            <Gid>
                <DomainName>[[DomainName]]</DomainName>
                <Xid>[[TravelStatus]]</Xid>
            </Gid>
        </StatusValueGid>
    </InternalShipmentStatus>
    <InternalShipmentStatus>
        <StatusTypeGid>
            <Gid>
                <DomainName>[[DomainName]]</DomainName>
                <Xid>CLL_STATUS_EMISSAO</Xid>
            </Gid>
        </StatusTypeGid>
        <StatusValueGid>
            <Gid>
                <DomainName>[[DomainName]]</DomainName>
                <Xid>[[EmissionStatus]]</Xid>
            </Gid>
        </StatusValueGid>
    </InternalShipmentStatus>
    <ServiceProviderGid>
        <Gid>
            <DomainName>[[CarrierDomainName]]</DomainName>
            <Xid>[[CarrierXid]]</Xid>
        </Gid>
    </ServiceProviderGid>
    <TransportModeGid>
        <Gid>
            <Xid>TL</Xid>
        </Gid>
    </TransportModeGid>
    <InvolvedParty>
        <InvolvedPartyQualifierGid>
            <Gid>
                <DomainName>[[DomainName]]</DomainName>
                <Xid>CLL_TOMADOR</Xid>
            </Gid>
        </InvolvedPartyQualifierGid>
        <InvolvedPartyLocationRef>
            <LocationRef>
                <LocationGid>
                    <Gid>
                        <DomainName>[[DomainName]]</DomainName>
                        <Xid>[[Taker]]</Xid>
                    </Gid>
                </LocationGid>
            </LocationRef>
        </InvolvedPartyLocationRef>
    </InvolvedParty>
</ShipmentHeader>`;

        const refnums: string = Refnum.getRefnumsXmlByType(this.refnums, RefnumType.Shipment);

        return xml.replaceAll('[[DomainName]]', this.shipmentDomainName)
            .replaceAll('[[Xid]]', this.shipmentXid)
            .replaceAll('[[Refnums]]', refnums)
            .replaceAll('[[TravelStatus]]', this.travelStatus)
            .replaceAll('[[EmissionStatus]]', this.emissionStatus)
            .replaceAll('[[CarrierDomainName]]', this.carrierDomainName)
            .replaceAll('[[CarrierXid]]', this.carrierXid)
            .replaceAll('[[Taker]]', this.taker);
    }
}

export class ShipmentHeader2 {
    public perspective: string = "Buy";

    constructor(tabFormContent: any) {
        if (tabFormContent.tabSelected === 0) {
            this.perspective = tabFormContent.inputContent.perspective;
        }
    }

    public convertToXml(): string {
        let xml = `<ShipmentHeader2>
    <Perspective>[[Perspective]]</Perspective>
</ShipmentHeader2>`;

        return xml.replaceAll('[[Perspective]]', (this.perspective === "Buy") ? 'B' : 'S');
    }
}

export class ShipmentStop {
    public stopSequence: string = "1";
    public locationDomainName: string = "EMBDEV";
    public locationXid: string = "XID";
    public stopType: string = "P";

    constructor(stopSequence: string, locationDomainName: string, locationXid: string, stopType: string) {
        this.stopSequence = stopSequence;
        this.locationDomainName = locationDomainName;
        this.locationXid = locationXid;
        this.stopType = stopType;
    }

    public convertToXml(): string {
        let xml = `<ShipmentStop>
    <StopSequence>[[StopSequence]]</StopSequence>
    <LocationRef>
        <LocationGid>
            <Gid>
                <DomainName>[[LocationDomainName]]</DomainName>
                <Xid>[[LocationXid]]</Xid>
            </Gid>
        </LocationGid>
    </LocationRef>
    <StopType>[[StopType]]</StopType>
</ShipmentStop>`;

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

    constructor(formLocation: any) {
        this.domainName = formLocation.domainName;
        this.xid = formLocation.xid;
        this.city = formLocation.city;
        this.uf = formLocation.uf;

        this.refnums = formLocation.refnums.Refnums as Refnum[];
    }
}

export class Release {
    public domainName: string = "EMBDEV";
    public xid: string = "XID";
    public shipFrom: string = "XID_ORIGEM";
    public shipTo: string = "XID_DESTINO";
    public refnums: Refnum[] = [];
    public orderMovements: OrderMovement[] = [];

    constructor(formRelease: any) {
        this.domainName = formRelease.releaseDomainName;
        this.xid = formRelease.releaseXid;
        this.shipFrom = formRelease.shipFrom;
        this.shipTo = formRelease.shipTo;

        this.refnums = formRelease.refnums.Refnums as Refnum[];
        this.orderMovements = formRelease.orderMovement.Movements as OrderMovement[];
    }
}

export class OrderMovement {
    public shipFrom: string = "XID_ORIGEM";
    public shipTo: string = "XID_DESTINO";
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
                    refnumXml = `<ShipmentRefnum>
        <ShipmentRefnumQualifierGid>
            <Gid>
                <DomainName>[[DomainName]]</DomainName>
                <Xid>[[Xid]]</Xid>
            </Gid>
        </ShipmentRefnumQualifierGid>
        <ShipmentRefnumValue>[[Value]]</ShipmentRefnumValue>
    </ShipmentRefnum>`;

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

    constructor(tabFormContent: any) {
        if (tabFormContent) {

            const formCost = tabFormContent.inputContent;

            this.baseCost = formCost.baseCost;

            this.acessorialCosts = formCost.acessorialCost.costs as AcessorialCost[];

            this.totalCost = formCost.totalCost;
        }
    }
}

export class AcessorialCost {
    public costXid: string = "DIARIA";
    public costValue: string = "50.00";
}

