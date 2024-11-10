export enum EntityType {
    Shipment,
    NFe,
    NotFound
}

export const EntityTypeLabel = new Map<number, string>([
    [EntityType.Shipment, 'Embarque'],
    [EntityType.NFe, 'NF-e'],
])