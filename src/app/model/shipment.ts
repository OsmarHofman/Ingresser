export class ShipmentHeader {
    public shipmentDomainName: string = "EMBDEV";
    public shipmentXid: string = "XID";
    public travelStatus: string = "PLANEJADO";
    public emissionStatus: string = "PRE_EMISSAO_PLANEJADA";
    public taker: string = "XID_TOMADOR";
    public carrierDomainName: string = "EMBDEV";
    public carrierXid: string = 'XID_TRANSPORTADOR';
    public refnums: Refnum[] = [];
}

export class ShipmentHeader2 {
    public perspective: string = "B";
}

export class ShipmentStop {
    public sequenceNumber: string = "1";
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
}

export class Release {
    public domainName: string = "EMBDEV";
    public xid: string = "XID";
    public shipFrom: string = "XID_ORIGEM";
    public shipTo: string = "XID_DESTINO";
    public refnums: Refnum[] = [];
    public orderMovements: OrderMovement[] = [];
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
}

export class AcessorialCost {
    public costXid: string = "DIARIA";
    public costValue: string = "50.00";
}

