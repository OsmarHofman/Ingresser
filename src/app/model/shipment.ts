export class Shipment {
    public shipmentHeader: ShipmentHeader;
    public shipmentHeader2: ShipmentHeader2;
    public stops: ShipmentStop[];
    public locations: Location[];
    public releases: Release[];
    public cost: Cost;

    constructor(shipmentHeader: ShipmentHeader, shipmentHeader2: ShipmentHeader2,
        stops: ShipmentStop[], locations: Location[], releases: Release[], cost: Cost) {
        this.shipmentHeader = shipmentHeader;
        this.shipmentHeader2 = shipmentHeader2;
        this.stops = stops;
        this.locations = locations;
        this.releases = releases;
        this.cost = cost;
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
}

export class ShipmentHeader2 {
    public perspective: string = "Buy";

    constructor(tabFormContent: any) {
        if (tabFormContent.tabSelected === 0) {
            this.perspective = tabFormContent.inputContent.perspective;
        }
    }
}

export class ShipmentStop {
    public stopSequence: string = "1";
    public locationDomainName: string = "EMBDEV";
    public locationXid: string = "XID";
    public stopType: string = "P";

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
    public value: string = 'CLL';
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

