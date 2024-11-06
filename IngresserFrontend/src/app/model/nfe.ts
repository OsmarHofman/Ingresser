export class NFe {

}

export class Ide {
    public static getNFeNumberFromXml(xml: string): string {
        return xml.slice(
            xml.indexOf('<nNF>') + '<nNF>'.length,
            xml.indexOf('</nNF>')
        );

    }
}