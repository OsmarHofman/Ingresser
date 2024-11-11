import { CreationSource } from "./enums/creation-source";
import { NFeBaseTag } from "./xml-tags";

export enum NFeParticipantType {
    Emit,
    Dest,
    Retirada,
    Entrega
}

export const NFeParticipantTypeLabel = new Map<number, string>([
    [NFeParticipantType.Emit, 'Emitente'],
    [NFeParticipantType.Dest, 'Destinatário'],
    [NFeParticipantType.Retirada, 'Retirada'],
    [NFeParticipantType.Entrega, 'Entrega'],
])

export const NFeParticipantTypeFormName = new Map<number, string>([
    [NFeParticipantType.Emit, 'emit'],
    [NFeParticipantType.Dest, 'dest'],
    [NFeParticipantType.Retirada, 'retirada'],
    [NFeParticipantType.Entrega, 'entrega'],
])

export class NFesAndId {
    public nfeXml: string;
    public id: string;

    constructor(nfeXml: string, id: string) {
        this.nfeXml = nfeXml;
        this.id = id;
    }

    public static convertNFeFormToXml(formNFe: any): NFesAndId {

        const nfe: NFe = new NFe(formNFe, CreationSource.Form);

        let nfeXml: string = '';

        const nfeIdeTab = formNFe.ide.tab;

        let nfeId: string = '';

        if (nfeIdeTab.tabSelected === 0) {
            nfeXml += nfe.convertIdeToXml();
            const nfeNumber: string = nfe.ide.number.padStart(9, '0');

            nfeId = `3520060766314000027055031${nfeNumber}1819146465`;
        } else {

            nfeXml += nfeIdeTab.xmlContent;

            nfeId = NFe.generateNFeIdByIdeTag(nfeIdeTab.xmlContent);
        }

        nfeXml += "\n";

        const nfeEmitTab = formNFe.emit.tab;

        if (nfeEmitTab.tabSelected === 0) {
            nfeXml += nfe.convertEmitToXml();
        } else {
            nfeXml += nfeEmitTab.xmlContent;
        }

        nfeXml += "\n";

        const nfeDestTab = formNFe.dest.tab;

        if (nfeDestTab.tabSelected === 0) {
            nfeXml += nfe.convertDestToXml();
        } else {
            nfeXml += nfeDestTab.xmlContent;
        }

        nfeXml += "\n";

        const nfeRetiradaTab = formNFe.retirada.tab;

        if (nfeRetiradaTab.tabSelected === 0) {
            nfeXml += nfe.convertRetiradaToXml();
        } else {
            nfeXml += nfeRetiradaTab.xmlContent;
        }

        nfeXml += "\n";

        const nfeEntregaTab = formNFe.entrega.tab;

        if (nfeEntregaTab.tabSelected === 0) {
            nfeXml += nfe.convertEntregaToXml();
        } else {
            nfeXml += nfeEntregaTab.xmlContent;
        }

        nfeXml += "\n";

        nfeXml += `${nfe.otherTags}\n`;

        const nfeInfAdicTab = formNFe.infAdic.tab;

        if (nfeInfAdicTab.tabSelected === 0) {
            nfeXml += nfe.convertInfAdicToXml();
        } else {
            nfeXml += nfeInfAdicTab.xmlContent;
        }

        nfeXml += "\n";

        return new NFesAndId(nfeXml, nfeId);
    }

}

export class NFe {

    public ide: Ide;
    public emit: Participant;
    public dest: Participant;
    public retirada: Participant;
    public entrega: Participant;
    public otherTags: string;
    public infAdic: InfAdic;

    constructor(nfeValue: any, source: CreationSource) {

        let nfeIde;
        let nfeEmit;
        let nfeDest;
        let nfeRetirada;
        let nfeEntrega;
        let infAdic;
        let otherTags;

        switch (source) {
            case CreationSource.Form:
                nfeIde = nfeValue.ide.tab;
                nfeEmit = nfeValue.emit.tab;
                nfeDest = nfeValue.dest.tab;
                nfeRetirada = nfeValue.retirada.tab;
                nfeEntrega = nfeValue.entrega.tab;
                infAdic = nfeValue.infAdic.tab;
                otherTags = nfeValue.otherTags.tab.xmlContent;

                break;

            case CreationSource.JSON:
                nfeIde = nfeValue.ide;
                nfeEmit = nfeValue.emit;
                nfeDest = nfeValue.dest;
                nfeRetirada = nfeValue.retirada;
                nfeEntrega = nfeValue.entrega;
                infAdic = nfeValue.infAdic;
                otherTags = nfeValue.otherTags;

                break;

            default:
                break;
        }

        this.ide = new Ide(nfeIde, source);
        this.emit = new Participant(nfeEmit, source, NFeParticipantType.Emit);
        this.dest = new Participant(nfeDest, source, NFeParticipantType.Dest);
        this.retirada = new Participant(nfeRetirada, source, NFeParticipantType.Retirada);
        this.entrega = new Participant(nfeEntrega, source, NFeParticipantType.Entrega);
        this.otherTags = otherTags;
        this.infAdic = new InfAdic(infAdic, source);
    }

    public convertIdeToXml(): string {
        if (this.ide) {
            return this.ide.convertToXml();
        }

        return '';
    }

    public convertEmitToXml(): string {
        if (this.emit) {
            return this.emit.convertToXml();
        }

        return '';
    }

    public convertDestToXml(): string {
        if (this.dest) {
            return this.dest.convertToXml();
        }

        return '';
    }

    public convertRetiradaToXml(): string {
        if (this.retirada && this.retirada.cnpj !== this.emit.cnpj) {
            return this.retirada.convertToXml();
        }

        return '';
    }

    public convertEntregaToXml(): string {
        if (this.entrega && this.entrega.cnpj !== this.dest.cnpj) {
            return this.entrega.convertToXml();
        }

        return '';
    }

    public convertInfAdicToXml(): string {
        if (this.infAdic) {
            return this.infAdic.convertToXml();
        }

        return '';
    }

    public static generateNFeIdByIdeTag(ideTag: string): string {

        const cUF = ideTag.slice(
            ideTag.indexOf('<cUF>') + '<cUF>'.length,
            ideTag.indexOf('</cUF>')
        );

        const today: Date = new Date();

        const yearLastDigits = today.getFullYear().toString().substring(2, 4);

        const month = (today.getMonth() + 1).toString().padStart(2, '0');

        const yearAndMonth = `${yearLastDigits}${month}`;

        const emit = '05257045000160';

        const mod = ideTag.slice(
            ideTag.indexOf('<mod>') + '<mod>'.length,
            ideTag.indexOf('</mod>')
        );

        const serie = ideTag.slice(
            ideTag.indexOf('<serie>') + '<serie>'.length,
            ideTag.indexOf('</serie>')
        ).padStart(3, '0');

        const nNF = ideTag.slice(
            ideTag.indexOf('<nNF>') + '<nNF>'.length,
            ideTag.indexOf('</nNF>')
        ).padStart(9, '0');

        const tpEmis = ideTag.slice(
            ideTag.indexOf('<tpEmis>') + '<tpEmis>'.length,
            ideTag.indexOf('</tpEmis>')
        );

        const cNF = ideTag.slice(
            ideTag.indexOf('<cNF>') + '<cNF>'.length,
            ideTag.indexOf('</cNF>')
        ).padStart(8, '0');

        const cDV = ideTag.slice(
            ideTag.indexOf('<cDV>') + '<cDV>'.length,
            ideTag.indexOf('</cDV>')
        );

        return `${cUF}${yearAndMonth}${emit}${mod}${serie}${nNF}${tpEmis}${cNF}${cDV}`;
    }

    public static addNFeFromEntity(nfe: NFe): any {
        const ideXml = nfe.convertIdeToXml();
        const emitXml = nfe.convertEmitToXml();
        const destXml = nfe.convertDestToXml();

        let retiradaXml = nfe.convertEmitToXml();

        if (nfe.retirada)
            retiradaXml = nfe.convertRetiradaToXml();

        let entregaXml = nfe.convertDestToXml();

        if (nfe.entrega)
            entregaXml = nfe.convertEntregaToXml();

        const infAdicXml = nfe.convertInfAdicToXml();

        let newFormNfe: any = {
            ide: {
                tab: {
                    inputContent: {
                        number: nfe.ide.number
                    },
                    tabSelected: 0,
                    xmlContent: ideXml
                }
            },
            emit: {
                tab: {
                    inputContent: {
                        cnpj: nfe.emit.cnpj,
                        name: nfe.emit.name,
                        address: {
                            ibgeCode: nfe.emit.address.ibgeCode,
                            city: nfe.emit.address.city,
                            uf: nfe.emit.address.uf,
                        }
                    },
                    tabSelected: 0,
                    xmlContent: emitXml
                }
            },
            dest: {
                tab: {
                    inputContent: {
                        cnpj: nfe.dest.cnpj,
                        name: nfe.dest.name,
                        address: {
                            ibgeCode: nfe.dest.address.ibgeCode,
                            city: nfe.dest.address.city,
                            uf: nfe.dest.address.uf,
                        }
                    },
                    tabSelected: 0,
                    xmlContent: destXml
                }
            },
            retirada: {
                tab: {
                    inputContent: {
                        cnpj: nfe.retirada.cnpj,
                        name: nfe.retirada.name,
                        address: {
                            ibgeCode: nfe.retirada.address.ibgeCode,
                            city: nfe.retirada.address.city,
                            uf: nfe.retirada.address.uf,
                        }
                    },
                    tabSelected: 0,
                    xmlContent: retiradaXml
                }
            },
            entrega: {
                tab: {
                    inputContent: {
                        cnpj: nfe.entrega.cnpj,
                        name: nfe.entrega.name,
                        address: {
                            ibgeCode: nfe.entrega.address.ibgeCode,
                            city: nfe.entrega.address.city,
                            uf: nfe.entrega.address.uf,
                        }
                    },
                    tabSelected: 0,
                    xmlContent: entregaXml
                }
            },
            otherTags: {
                tab: {
                    tabSelected: 0,
                    xmlContent: nfe.otherTags
                }
            },
            infAdic: {
                tab: {
                    inputContent: {
                        idor: nfe.infAdic.idor
                    },
                    tabSelected: 0,
                    xmlContent: infAdicXml
                }
            }
        };

        return newFormNfe;
    }

    public static getNFeDefaultFormValues(): any {
        return {
            ide: {
                tab: {
                    inputContent: {
                        number: "123456"
                    },
                    tabSelected: 0,
                    xmlContent: NFeBaseTag.Ide
                }
            },
            emit: {
                tab: {
                    inputContent: {
                        cnpj: "96973902000183",
                        name: "Emitente da NF-e",
                        address: {
                            ibgeCode: "3550308",
                            city: "SAO PAULO",
                            uf: "SP"
                        }
                    },
                    tabSelected: 0,
                    xmlContent: NFeBaseTag.Emit
                }
            },
            dest: {
                tab: {
                    inputContent: {
                        cnpj: "05257045000160",
                        name: "Destinatario da NF-e",
                        address: {
                            ibgeCode: "4209300",
                            city: "LAGES",
                            uf: "SC"
                        }
                    },
                    tabSelected: 0,
                    xmlContent: NFeBaseTag.Dest
                }
            },
            retirada: {
                tab: {
                    inputContent: {
                        cnpj: "96973902000183",
                        name: "Retirada da NF-e",
                        address: {
                            ibgeCode: "3550308",
                            city: "SAO PAULO",
                            uf: "SP"
                        }
                    },
                    tabSelected: 0,
                    xmlContent: NFeBaseTag.Retirada
                }
            },
            entrega: {
                tab: {
                    inputContent: {
                        cnpj: "05257045000160",
                        name: "Entrega da NF-e",
                        address: {
                            ibgeCode: "4209300",
                            city: "LAGES",
                            uf: "SC"
                        }
                    },
                    tabSelected: 0,
                    xmlContent: NFeBaseTag.Entrega
                }
            },
            otherTags: {
                tab: {
                    tabSelected: 0,
                    xmlContent: NFeBaseTag.OtherTags
                }
            },
            infAdic: {
                tab: {
                    inputContent: {
                        idor: "EMBDEV.ORDEM1"
                    },
                    tabSelected: 0,
                    xmlContent: NFeBaseTag.InfAdic
                }
            }
        };
    }

    public static getNewNFeByExistent(existentNFe: any): any {

        const ideTab = existentNFe.ide.tab;

        const emitTab = existentNFe.emit.tab;

        const emitInputContent = emitTab.inputContent;

        const destTab = existentNFe.dest.tab;

        const destInputContent = destTab.inputContent;

        const retiradaTab = existentNFe.retirada.tab;

        const retiradaInputContent = retiradaTab.inputContent;

        const entregaTab = existentNFe.entrega.tab;

        const entregaInputContent = entregaTab.inputContent;

        const otherTab = existentNFe.otherTags.tab;

        const infAdicTab = existentNFe.infAdic.tab;

        let newFormNfe: any = {
            ide: {
                tab: {
                    inputContent: {
                        number: ideTab.inputContent.number
                    },
                    tabSelected: ideTab.tabSelected,
                    xmlContent: ideTab.xmlContent
                }
            },
            emit: {
                tab: {
                    inputContent: {
                        cnpj: emitInputContent.cnpj,
                        name: emitInputContent.name,
                        address: {
                            ibgeCode: emitInputContent.address.ibgeCode,
                            city: emitInputContent.address.city,
                            uf: emitInputContent.address.uf,
                        }
                    },
                    tabSelected: emitTab.tabSelected,
                    xmlContent: emitTab.xmlContent
                }
            },
            dest: {
                tab: {
                    inputContent: {
                        cnpj: destInputContent.cnpj,
                        name: destInputContent.name,
                        address: {
                            ibgeCode: destInputContent.address.ibgeCode,
                            city: destInputContent.address.city,
                            uf: destInputContent.address.uf,
                        }
                    },
                    tabSelected: destTab.tabSelected,
                    xmlContent: destTab.xmlContent
                }
            },
            retirada: {
                tab: {
                    inputContent: {
                        cnpj: retiradaInputContent.cnpj,
                        name: retiradaInputContent.name,
                        address: {
                            ibgeCode: retiradaInputContent.address.ibgeCode,
                            city: retiradaInputContent.address.city,
                            uf: retiradaInputContent.address.uf,
                        }
                    },
                    tabSelected: retiradaTab.tabSelected,
                    xmlContent: retiradaTab.xmlContent
                }
            },
            entrega: {
                tab: {
                    inputContent: {
                        cnpj: entregaInputContent.cnpj,
                        name: entregaInputContent.name,
                        address: {
                            ibgeCode: entregaInputContent.address.ibgeCode,
                            city: entregaInputContent.address.city,
                            uf: entregaInputContent.address.uf,
                        }
                    },
                    tabSelected: entregaTab.tabSelected,
                    xmlContent: entregaTab.xmlContent
                }
            },
            otherTags: {
                tab: {
                    tabSelected: 0,
                    xmlContent: otherTab.xmlContent
                }
            },
            infAdic: {
                tab: {
                    inputContent: {
                        idor: infAdicTab.inputContent.idor
                    },
                    tabSelected: infAdicTab.tabSelected,
                    xmlContent: infAdicTab.xmlContent
                }
            }
        };

        return newFormNfe;
    }
}

export class Ide {

    public number: string = '123456';

    constructor(content: any, source: CreationSource) {

        switch (source) {
            case CreationSource.Form:
                if (content.tabSelected === 0) {
                    this.number = content.inputContent.number;
                }

                break;

            case CreationSource.JSON:
                this.number = content.number;

                break;

            default:
                break;
        }
    }

    public static getNFeNumberFromXml(xml: string): string {

        return xml.slice(
            xml.indexOf('<nNF>') + '<nNF>'.length,
            xml.indexOf('</nNF>')
        );
    }

    public convertToXml(): string {
        return `<ide>
				<cUF>35</cUF>
				<cNF>53900839</cNF>
				<natOp>VENDA ADQUIRIDAS E OU TER</natOp>
				<mod>55</mod>
				<serie>3</serie>
				<nNF>[[Number]]</nNF>
				<dhEmi>2019-10-19T21:58:45-02:00</dhEmi>
				<dhSaiEnt>2019-10-19T22:13:50-02:00</dhSaiEnt>
				<tpNF>1</tpNF>
				<idDest>2</idDest>
				<cMunFG>3515004</cMunFG>
				<tpImp>2</tpImp>
				<tpEmis>1</tpEmis>
				<cDV>0</cDV>
				<tpAmb>1</tpAmb>
				<finNFe>1</finNFe>
				<indFinal>0</indFinal>
				<indPres>9</indPres>
				<procEmi>0</procEmi>
				<verProc>SynchroDFe_3.2.4.4</verProc>
			</ide>`.replace('[[Number]]', this.number);
    }
}

export class Participant {

    public cnpj: string = '96973902000183';
    public name: string = 'Emitente da NF-e';
    public address: Address;
    public type: NFeParticipantType = NFeParticipantType.Emit;

    constructor(content: any, source: CreationSource, participantType: NFeParticipantType) {

        this.type = participantType;

        let address;

        switch (source) {
            case CreationSource.Form:
                if (content.tabSelected === 0) {
                    const inputContent = content.inputContent;

                    this.name = inputContent.name;
                    this.cnpj = inputContent.cnpj;
                    address = inputContent.address;
                }

                break;

            case CreationSource.JSON:

                this.cnpj = content.cnpj;
                this.name = content.name;
                address = content.address;

                break;

            default:
                break;
        }

        this.address = new Address(address);
    }

    public convertToXml(): string {
        let xml = ``;

        switch (this.type) {
            case NFeParticipantType.Emit:
                xml += `<emit>
                <CNPJ>[[CNPJ]]</CNPJ>
				<xNome>[[Name]]</xNome>
				<xFant>Fantasia Emitente da NF-e</xFant>
				<enderEmit>
					<xLgr>Rua do Emitente</xLgr>
					<nro>1481</nro>
					<xCpl>Info Complementaria do Logradouro</xCpl>
					<xBairro>Bairro Emitente</xBairro>
					<cMun>[[IBGECode]]</cMun>
					<xMun>[[City]]</xMun>
					<UF>[[UF]]</UF>
					<CEP>06845070</CEP>
					<cPais>1058</cPais>
					<xPais>BRASIL</xPais>
				</enderEmit>
				<IE>298280913119</IE>
				<CRT>3</CRT>
                </emit>`

                break;

            case NFeParticipantType.Dest:
                xml += `<dest>
                <CNPJ>[[CNPJ]]</CNPJ>
				<xNome>[[Name]]</xNome>
				<enderDest>
					<xLgr>Rua do Destinatario</xLgr>
					<nro>1003</nro>
					<xBairro>Bairro Destinatario</xBairro>
					<cMun>[[IBGECode]]</cMun>
					<xMun>[[City]]</xMun>
					<UF>[[UF]]</UF>
					<CEP>32183680</CEP>
					<cPais>1058</cPais>
					<xPais>BRASIL</xPais>
					<fone>2124722123</fone>
				</enderDest>
				<indIEDest>1</indIEDest>
				<IE>3671539868959</IE>
                </dest>`

                break;

            case NFeParticipantType.Retirada:
                xml += `<retirada>
				<CNPJ>[[CNPJ]]</CNPJ>
				<xNome>[[Name]]</xNome>
				<xLgr>LOG RETIRADA</xLgr>
				<nro>100</nro>
				<xBairro>BAIRRO RETIRADA</xBairro>
				<cMun>[[IBGECode]]</cMun>
				<xMun>[[City]]</xMun>
				<UF>[[UF]]</UF>
				<CEP>32183680</CEP>
				<cPais>1058</cPais>
				<xPais>BRASIL</xPais>
				<fone>2124722123</fone>
				<IE>3671539868959</IE>
			    </retirada>`

                break;

            case NFeParticipantType.Entrega:
                xml += `<entrega>
				<CNPJ>[[CNPJ]]</CNPJ>
				<xNome>[[Name]]</xNome>
				<xLgr>LOG ENTREGA</xLgr>
				<nro>100</nro>
				<xBairro>BAIRRO ENTREGA</xBairro>
				<cMun>[[IBGECode]]</cMun>
				<xMun>[[City]]</xMun>
				<UF>[[UF]]</UF>
				<CEP>32183680</CEP>
				<cPais>1058</cPais>
				<xPais>BRASIL</xPais>
				<fone>2124722123</fone>
				<IE>3671539868959</IE>
			</entrega>`

                break;

            default:
                break;
        }

        return xml.replace('[[CNPJ]]', this.cnpj)
            .replace('[[Name]]', this.name)
            .replace('[[IBGECode]]', this.address.ibgeCode)
            .replace('[[City]]', this.address.city)
            .replace('[[UF]]', this.address.uf);
    }
}

export class InfAdic {

    public idor: string = 'EMBDEV.ORDEM1';

    constructor(content: any, source: CreationSource) {

        switch (source) {
            case CreationSource.Form:
                if (content.tabSelected === 0) {
                    this.idor = content.inputContent.idor;
                }

                break;

            case CreationSource.JSON:
                this.idor = content.idor;

                break;

            default:
                break;
        }
    }

    public convertToXml(): string {
        return `<infAdic>
				<infCpl>IDOR|[[Idor]]|IDOR</infCpl>
			</infAdic>`.replace('[[Idor]]', this.idor);
    }
}

export class Address {

    public city: string = 'SAO PAULO';
    public ibgeCode: string = '3550308';
    public uf: string = 'SP';

    constructor(addressValue: any) {
        if (addressValue) {
            this.city = addressValue.city;
            this.ibgeCode = addressValue.ibgeCode;
            this.uf = addressValue.uf;
        }
    }
}