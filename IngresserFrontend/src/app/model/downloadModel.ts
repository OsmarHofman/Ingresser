import { EntityType } from "./entityType";

export class DownloadModel {
    public formValue: any;
    public entitiesTypes: EntityType[];

    constructor(formValue: any, entitiesTypes: EntityType[]){
        this.formValue = formValue;
        this.entitiesTypes = entitiesTypes;
    }
}