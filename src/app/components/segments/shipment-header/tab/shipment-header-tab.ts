import {
    Component,
    Input,
    OnDestroy,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { InputComponentsService } from '../../../../service/input-components-service';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShipmentHeaderInputComponent } from './shipment-header-input/shipment-header-input';

@Component({
    selector: 'shipment-header-tab',
    templateUrl: 'shipment-header-tab.html',
    styleUrl: 'shipment-header-tab.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        ShipmentHeaderInputComponent,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ShipmentHeaderTabComponent
        }
    ]
})

export class ShipmentHeaderTabComponent implements ControlValueAccessor, OnDestroy {

    //#region Form

    tabForm: FormGroup = this.formBuilder.group({
        inputContent: [''],
        xmlContent: [''],
    });

    constructor(private formBuilder: FormBuilder) { }

    onTouched: Function = () => { };

    onChangeSubs: Subscription[] = [];

    ngOnDestroy(): void {
        this.onChangeSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    registerOnChange(onChange: any): void {
        const sub = this.tabForm.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled)
            this.tabForm.disable();
        else
            this.tabForm.enable();
    }

    writeValue(value: any): void {
        if (value)
            this.tabForm.setValue(value, { emitEvent: false });
    }

    //#endregion

    @Input() inputComponent: string = '';
    @Input() xmlContent: string = '';

    public hasXmlContent(): boolean {
        return (this.xmlContent) ? true : false;
    }

    private componentList = inject(InputComponentsService).getComponents();

    get currentInputComponent() {
        const currentComponent = this.componentList.find(component => component.component.name.includes(this.inputComponent));

        if (currentComponent)
            return currentComponent;

        return this.componentList[0];
    }
}