export class AccordionItem {
    public inputComponent: string;
    public label: string;
    public xmlContent: string;

    constructor(inputComponent: string, label: string, xmlContent: string) {
        this.inputComponent = inputComponent;
        this.label = label;
        this.xmlContent = xmlContent;
    }
}