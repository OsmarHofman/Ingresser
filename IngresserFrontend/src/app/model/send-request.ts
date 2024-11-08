import { Configs } from "../components/dialogs/configs-option/configs";
import { EntityType } from "./entityType";

export class SendRequest {
    public xml: string;
    public entityType: EntityType;
    public configs: Configs;

    constructor(xml: string, entityType: EntityType, configs: Configs) {
        this.xml = xml;
        this.entityType = entityType;
        this.configs = configs;
    }
}