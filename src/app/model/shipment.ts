import { FormGroup } from "@angular/forms";
import { RefnumType } from "./refnumType";
import { CostType } from "./costType";

export class Shipment {
    public shipmentHeader: ShipmentHeader;
    public shipmentHeader2: ShipmentHeader2;
    public stops: ShipmentStop[];
    public locations: Location[];
    public releases: Release[];

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

                const shipmentStop = new ShipmentStop(formStop.stopSequence,
                    formStop.locationDomainName,
                    formStop.locationXid,
                    formStop.stopType
                );

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
    [[ShipmentCost]]
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
            .replaceAll('[[Taker]]', this.taker)
            .replaceAll('[[ShipmentCost]]', this.cost.convertToXml(CostType.Shipment, this.shipmentDomainName));
    }

    public static getShipmentXidFromXml(xml: string): string {
        const shipmentGid = xml.slice(
            xml.indexOf('ShipmentGid'),
            xml.indexOf('/ShipmentGid')
        );

        return shipmentGid
            .slice(
                shipmentGid.indexOf('<Xid>') + '<Xid>'.length,
                shipmentGid.indexOf('</Xid>')
            );
    }

    public static getCarrierXidFromXml(xml: string): string {
        const shipmentGid = xml.slice(
            xml.indexOf('ServiceProviderGid'),
            xml.indexOf('/ServiceProviderGid')
        );

        return shipmentGid
            .slice(
                shipmentGid.indexOf('<Xid>') + '<Xid>'.length,
                shipmentGid.indexOf('</Xid>')
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
        let xml = `<ShipmentHeader2>
    <Perspective>[[Perspective]]</Perspective>
</ShipmentHeader2>`;

        return xml.replaceAll('[[Perspective]]', (this.perspective === "Buy") ? 'B' : 'S');
    }

    public static getPerspectiveFromXml(xml: string): string {
        return xml
            .slice(
                xml.indexOf('<Perspective>') + '<Perspective>'.length,
                xml.indexOf('</Perspective>')
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

    public convertToXml(): string {
        let xml = `<Location>
    <LocationGid>
        <Gid>
            <DomainName>[[DomainName]]</DomainName>
            <Xid>[[Xid]]</Xid>
        </Gid>
    </LocationGid>
    <LocationName>[[Xid]]</LocationName>
    <Address>
        <AddressLines>
            <SequenceNumber>1</SequenceNumber>
            <AddressLine>ROD BR-262 SN KM 7.5</AddressLine>
        </AddressLines>
        <City>[[City]]</City>
        <ProvinceCode>[[Uf]]</ProvinceCode>
        <PostalCode>29136350</PostalCode>
        <CountryCode3Gid>
            <Gid>
                <Xid>BR</Xid>
            </Gid>
        </CountryCode3Gid>
    </Address>
    [[Refnums]]
</Location>`;

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

    constructor(formRelease: any) {
        this.domainName = formRelease.releaseDomainName;
        this.xid = formRelease.releaseXid;
        this.shipFrom = formRelease.shipFrom;
        this.shipTo = formRelease.shipTo;
        this.taker = formRelease.taker;

        this.refnums = formRelease.refnums.Refnums as Refnum[];

        if (formRelease.releaseCost) {
            this.cost = new Cost(formRelease.releaseCost);
        }

        this.orderMovements = [];

        for (let index = 0; index < formRelease.orderMovement.Movements.length; index++) {
            const formOrderMovement = formRelease.orderMovement.Movements[index];

            const orderMovement = new OrderMovement(formOrderMovement.shipFrom, formOrderMovement.shipTo);

            this.orderMovements.push(orderMovement);
        }
    }

    public convertToXml(shipmentXid: string, perspective: string, carrierXid: string): string {
        let xml = `<Release>
    <ReleaseGid>
        <Gid>
            <DomainName>[[DomainName]]</DomainName>
            <Xid>[[Xid]]</Xid>
        </Gid>
    </ReleaseGid>
    <ShipFromLocationRef>
        <LocationRef>
            <LocationGid>
                <Gid>
                    <DomainName>[[DomainName]]</DomainName>
                    <Xid>[[ShipFrom]]</Xid>
                </Gid>
            </LocationGid>
        </LocationRef>
    </ShipFromLocationRef>
    <ShipToLocationRef>
        <LocationRef>
            <LocationGid>
                <Gid>
                    <DomainName>[[DomainName]]</DomainName>
                    <Xid>[[ShipTo]]</Xid>
                </Gid>
            </LocationGid>
        </LocationRef>
    </ShipToLocationRef>
    [[ReleaseCost]]
    [[OrderMovement]]
    [[Refnums]]
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
</Release>`;

        const refnums = Refnum.getRefnumsXmlByType(this.refnums, RefnumType.Release);

        let orderMovementXml: string = '';

        for (let index = 0; index < this.orderMovements.length; index++) {

            const orderMovement = this.orderMovements[index];

            orderMovementXml += orderMovement.convertToXml(this.domainName, this.xid, perspective, shipmentXid, carrierXid);
        }

        const cost: string = this.cost.convertToXml(CostType.Release, this.domainName, shipmentXid);

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

        let xml = `<OrderMovement>
    <OrderMovementGid>
        <Gid>
            <DomainName>[[DomainName]]</DomainName>
            <Xid>OMOVEMENT1</Xid>
        </Gid>
    </OrderMovementGid>
    <OrderReleaseGid>
        <Gid>
            <DomainName>[[DomainName]]</DomainName>
            <Xid>[[ReleaseXid]]</Xid>
        </Gid>
    </OrderReleaseGid>
    <Perspective>[[ShipmentPerspective]]</Perspective>
    <ShipFromLocationRef>
        <LocationRef>
            <Location>
                <LocationGid>
                    <Gid>
                        <DomainName>[[DomainName]]</DomainName>
                        <Xid>[[ShipFrom]]</Xid>
                    </Gid>
                </LocationGid>
            </Location>
        </LocationRef>
    </ShipFromLocationRef>
    <ShipToLocationRef>
        <LocationRef>
            <Location>
                <LocationGid>
                    <Gid>
                        <DomainName>[[DomainName]]</DomainName>
                        <Xid>[[ShipTo]]</Xid>
                    </Gid>
                </LocationGid>
            </Location>
        </LocationRef>
    </ShipToLocationRef>
    <ShipmentGid>
        <Gid>
            <DomainName>[[DomainName]]</DomainName>
            <Xid>[[ShipmentXid]]</Xid>
        </Gid>
    </ShipmentGid>
    <ServiceProviderGid>
        <Gid>
            <DomainName>[[DomainName]]</DomainName>
            <Xid>[[CarrierXid]]</Xid>
        </Gid>
    </ServiceProviderGid>
</OrderMovement>`;

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

                case RefnumType.Location:
                    refnumXml = `<LocationRefnum>
        <LocationRefnumQualifierGid>
            <Gid>
                <DomainName>[[DomainName]]</DomainName>
                <Xid>[[Xid]]</Xid>
            </Gid>
        </LocationRefnumQualifierGid>
        <LocationRefnumValue>[[Value]]</LocationRefnumValue>
    </LocationRefnum>`;

                    break;

                case RefnumType.Release:
                    refnumXml = `<ReleaseRefnum>
    <ReleaseRefnumQualifierGid>
        <Gid>
            <DomainName>[[DomainName]]</DomainName>
            <Xid>[[Xid]]</Xid>
        </Gid>
    </ReleaseRefnumQualifierGid>
    <ReleaseRefnumValue>[[Value]]</ReleaseRefnumValue>
</ReleaseRefnum>`;

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

    public convertToXml(costType: CostType, shipmentDomainName: string, shipmentXid: string = '') {

        let xml: string = '';

        switch (costType) {
            case CostType.Shipment:
                xml = `<TotalPlannedCost>
        <FinancialAmount>
            <GlobalCurrencyCode>BRL</GlobalCurrencyCode>
            <MonetaryAmount>[[TotalCost]]</MonetaryAmount>
        </FinancialAmount>
    </TotalPlannedCost>
    <TotalActualCost>
        <FinancialAmount>
            <GlobalCurrencyCode>BRL</GlobalCurrencyCode>
            <MonetaryAmount>[[TotalCost]]</MonetaryAmount>
        </FinancialAmount>
    </TotalActualCost>
    <TotalWeightedCost>
        <FinancialAmount>
            <GlobalCurrencyCode>BRL</GlobalCurrencyCode>
            <MonetaryAmount>[[TotalCost]]</MonetaryAmount>
        </FinancialAmount>
    </TotalWeightedCost>
    <ShipmentCost>
        <ShipmentCostSeqno>1</ShipmentCostSeqno>
        <CostType>B</CostType>
        <Cost>
            <FinancialAmount>
                <GlobalCurrencyCode>BRL</GlobalCurrencyCode>
                <MonetaryAmount>[[BaseCost]]</MonetaryAmount>
            </FinancialAmount>
        </Cost>
    </ShipmentCost>
    [[AccessorialCost]]`;

                break;

            case CostType.Release:
                xml = `<ReleaseAllocationInfo>
        <ReleaseAllocByType>
            <AllocTypeQualGid>
                <Gid>
                    <Xid>PLANNING</Xid>
                </Gid>
            </AllocTypeQualGid>
            <ReleaseAllocShipment>
                <ShipmentGid>
                    <Gid>
                        <DomainName>[[DomainName]]</DomainName>
                        <Xid>[[ShipmentXid]]</Xid>
                    </Gid>
                </ShipmentGid>
                <TotalAllocCost>
                    <FinancialAmount>
                        <GlobalCurrencyCode>BRL</GlobalCurrencyCode>
                        <MonetaryAmount>[[TotalCost]]</MonetaryAmount>
                        <RateToBase>0.5639521768554027</RateToBase>
                        <FuncCurrencyAmount>0.0</FuncCurrencyAmount>
                    </FinancialAmount>
                </TotalAllocCost>
            </ReleaseAllocShipment>
            <ReleaseAllocShipmentDetail>
                <Cost>
                    <FinancialAmount>
                        <GlobalCurrencyCode>BRL</GlobalCurrencyCode>
                        <MonetaryAmount>[[BaseCost]]</MonetaryAmount>
                        <RateToBase>0.5639521768554027</RateToBase>
                        <FuncCurrencyAmount>0.0</FuncCurrencyAmount>
                    </FinancialAmount>
                </Cost>
                <CostTypeGid>
                    <Gid>
                        <Xid>B</Xid>
                    </Gid>
                </CostTypeGid>
                <CostDescription>B</CostDescription>
            </ReleaseAllocShipmentDetail>
            [[AccessorialCost]]
        </ReleaseAllocByType>
    </ReleaseAllocationInfo>`;

                break;

            default:
                break;
        }

        var accessorialCost: string = AcessorialCost.getAccessorialXmlByType(this.acessorialCosts, costType, shipmentDomainName);

        return xml.replaceAll('[[TotalCost]]', this.totalCost)
            .replaceAll('[[BaseCost]]', this.baseCost)
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
                    costXml = `<ShipmentCost>
    <ShipmentCostSeqno>465001</ShipmentCostSeqno>
    <CostType>A</CostType>
    <Cost>
        <FinancialAmount>
            <GlobalCurrencyCode>BRL</GlobalCurrencyCode>
            <MonetaryAmount>[[CostValue]]</MonetaryAmount>
        </FinancialAmount>
    </Cost>
    <AccessorialCodeGid>
        <Gid>
            <DomainName>[[DomainName]]</DomainName>
            <Xid>[[CostXid]]</Xid>
        </Gid>
    </AccessorialCodeGid>
</ShipmentCost>`;

                    break;

                case CostType.Release:
                    costXml = `<ReleaseAllocShipmentDetail>
                <AllocSeqNo>79997</AllocSeqNo>
                <AllocCostSeqno>8</AllocCostSeqno>
                <Cost>
                    <FinancialAmount>
                        <GlobalCurrencyCode>BRL</GlobalCurrencyCode>
                        <MonetaryAmount>[[CostValue]]</MonetaryAmount>
                        <RateToBase>0.5639521768554027</RateToBase>
                        <FuncCurrencyAmount>0.0</FuncCurrencyAmount>
                    </FinancialAmount>
                </Cost>
                <CostTypeGid>
                    <Gid>
                        <Xid>A</Xid>
                    </Gid>
                </CostTypeGid>
                <AccessorialCodeGid>
                    <Gid>
                        <DomainName>[[DomainName]]</DomainName>
                        <Xid>[[CostXid]]</Xid>
                    </Gid>
                </AccessorialCodeGid>
                <FlexFieldStrings />
                <FlexFieldNumbers />
                <FlexFieldDates />
            </ReleaseAllocShipmentDetail>`;

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
