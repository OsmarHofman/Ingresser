export enum EntityType {
    Shipment,
    NFe
}

export const EntityTypeLabel = new Map<number, string>([
    [EntityType.Shipment, 'Embarque'],
    [EntityType.NFe, 'NF-e'],
])

export class SendEntity {
    public type: EntityType;
    public entityListIndex: number;

    constructor (type: EntityType, entityListIndex: number){
        this.type = type;
        this.entityListIndex = entityListIndex;
    }
}