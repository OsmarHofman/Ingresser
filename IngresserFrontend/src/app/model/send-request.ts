import { EntityType } from "./entityType";

export class SendRequest {
    public xml: string;
    public entityType: EntityType;

    constructor(xml: string, entityType: EntityType) {
        this.xml = xml;
        this.entityType = entityType;
    }

    public getUrlWithPort(port: number): string {
        switch (this.entityType) {

            case EntityType.Shipment:
                
                return `https://pr.dev.nddfrete.com.br:${port}/tmsExchangeMessage/TMSExchangeMessage.asmx`;

            case EntityType.NFe:

                return `https://pr.dev.nddfrete.com.br:${port}/exchangeMessage/WSExchangeMessage.asmx`;

            default:
                return '';
        }
    }
}