export enum EntityType {
    Shipment,
}

export const EntityTypeLabel = new Map<number, string>([
    [EntityType.Shipment, 'Embarque']
])

export class SendEntity {
    public type: EntityType;
    public entityListIndex: number;

    constructor (type: EntityType, entityListIndex: number){
        this.type = type;
        this.entityListIndex = entityListIndex;
    }
}