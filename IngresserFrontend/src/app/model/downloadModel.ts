import { FormGroup } from "@angular/forms";
import { EntityType } from "./entityType";

export class DownloadModel {
    public formValue: FormGroup<any>;
    public entitiesTypes: EntityType[];

    constructor(formValue: FormGroup<any>, entitiesTypes: EntityType[]){
        this.formValue = formValue;
        this.entitiesTypes = entitiesTypes;
    }
}