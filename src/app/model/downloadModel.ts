import { FormGroup } from "@angular/forms";
import { SendEntity } from "./entityType";

export class DownloadModel {
    public formValue: FormGroup<any>;
    public entitiesOrder: SendEntity[];

    constructor(formValue: FormGroup<any>, entitiesOrder: SendEntity[]){
        this.formValue = formValue;
        this.entitiesOrder = entitiesOrder;
    }
}