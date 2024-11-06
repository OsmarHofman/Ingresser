export enum WsType {
    ShipmentWS,
    DocumentsWS,
}

export class SendRequest {
    public xml: string;
    public wsType: WsType;

    constructor(xml: string, ws: WsType) {
        this.xml = xml;
        this.wsType = ws;
    }
}