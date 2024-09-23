import { RefnumType } from "./refnumType";
import { CostType } from "./costType";

export class Shipment {
    public shipmentHeader: ShipmentHeader;
    public shipmentHeader2: ShipmentHeader2;
    public stops: ShipmentStop[];
    public locations: Location[];
    public releases: Release[];

    constructor(shipmentValue: any) {

        const shipmentHeaderTab = shipmentValue.shipmentHeader.tab;

        this.shipmentHeader = new ShipmentHeader(shipmentHeaderTab);

        const shipmentHeader2Tab = shipmentValue.shipmentHeader2.tab;

        this.shipmentHeader2 = new ShipmentHeader2(shipmentHeader2Tab);

        this.stops = [];

        if (shipmentValue.shipmentStop.tab.tabSelected === 0) {

            const formStops = shipmentValue.shipmentStop.tab.inputContent.stops;

            formStops.forEach((formStop: any) => {
                const shipmentStop = new ShipmentStop(formStop.stopSequence,
                    formStop.locationDomainName,
                    formStop.locationXid,
                    formStop.stopType
                );

                this.stops.push(shipmentStop);
            });

        }

        this.locations = [];

        if (shipmentValue.location.tab.tabSelected === 0) {

            const formLocations = shipmentValue.location.tab.inputContent.locations;

            formLocations.forEach((formLocation: any) => {
                const location = new Location(formLocation.location);
                this.locations.push(location);
            });
        }

        this.releases = [];

        if (shipmentValue.release.tab.tabSelected === 0) {

            const formReleases = shipmentValue.release.tab.inputContent.Releases;

            formReleases.forEach((formRelease: any) => {

                const release = new Release(formRelease.release);

                this.releases.push(release);

            });
        }
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
    public cost: Cost = new Cost(null);

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

            if (inputContent.shipmentRefnums)
                this.refnums = inputContent.shipmentRefnums.Refnums as Refnum[];

            this.cost = new Cost(inputContent.shipmentCost);
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
        
        const statusViagemValue =  statusViagemTag.slice(
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

    constructor(tabFormContent: any) {
        if (tabFormContent.tabSelected === 0) {
            this.perspective = tabFormContent.inputContent.perspective;
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

    constructor(stopSequence: string, locationDomainName: string, locationXid: string, stopType: string) {
        this.stopSequence = stopSequence;
        this.locationDomainName = locationDomainName;
        this.locationXid = locationXid;
        this.stopType = stopType;
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

    constructor(formLocation: any) {
        this.domainName = formLocation.domainName;
        this.xid = formLocation.xid;
        this.city = formLocation.city;
        this.uf = formLocation.uf;

        this.refnums = formLocation.refnums.Refnums as Refnum[];
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
    public cost: Cost = new Cost('');
    public useShipmentCost: boolean = false;

    constructor(formRelease: any) {
        this.domainName = formRelease.releaseDomainName;
        this.xid = formRelease.releaseXid;
        this.shipFrom = formRelease.shipFrom;
        this.shipTo = formRelease.shipTo;
        this.taker = formRelease.taker;

        this.refnums = formRelease.refnums.Refnums as Refnum[];

        if (formRelease.releaseCost) {
            this.cost = new Cost(formRelease.releaseCost);
        } else {
            this.useShipmentCost = true;
        }

        this.orderMovements = [];

        for (let index = 0; index < formRelease.orderMovement.Movements.length; index++) {
            const formOrderMovement = formRelease.orderMovement.Movements[index];

            const orderMovement = new OrderMovement(formOrderMovement.shipFrom, formOrderMovement.shipTo);

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

    constructor(formCost: any) {
        if (formCost) {

            this.baseCost = formCost.baseCost;

            if (formCost.acessorialCost) {

                for (let index = 0; index < formCost.acessorialCost.costs.length; index++) {
                    const formAcessorialCost = formCost.acessorialCost.costs[index];

                    const acessorialCost: AcessorialCost = new AcessorialCost(formAcessorialCost.xid, formAcessorialCost.costValue);

                    this.acessorialCosts.push(acessorialCost);

                }

            }

            this.totalCost = formCost.totalCost;
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
