export class ShipmentOptionsResult {
    public action: string = '';
    public shipments: string[] = [''];

    constructor(action: string, shipments: string[]){
        this.action = action;
        this.shipments = shipments;
    }
}