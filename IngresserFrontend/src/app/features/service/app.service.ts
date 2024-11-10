import { FormGroup } from "@angular/forms";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ResultMessage } from "../shared/result-message";
import { Shipment, ShipmentHeader, ShipmentHeader2, Refnum, ShipmentStop, Location, Release, OrderMovement } from "../../model/shipment";
import { NFeBaseTag, ShipmentBaseTag } from "../../model/xml-base-tags";
import { ValuesConfiguration } from "../../model/values-configuration";
import { NFe, NFesAndId } from "../../model/nfe";
import { CreationSource } from "../../model/enums/creation-source";
import { SendRequest } from "../../model/send-request";
import { EntityType } from "../../model/entityType";
import { Configs } from "../../components/dialogs/configs-option/configs";

const backendUrl = "http://localhost:5181/sendXml";

@Injectable()
export class AppService {

    public wsUrl = 'https://pr.dev.nddfrete.com.br:1081/tmsExchangeMessage/TMSExchangeMessage.asmx';

    private configuration: ValuesConfiguration = new ValuesConfiguration();

    constructor(private http: HttpClient) {
        this.getConfigurationFromFile();
    }

    public convertShipmentFormToXml(formShipment: any): string {

        if (!this.configuration) return '';

        const shipment: Shipment = new Shipment(formShipment, CreationSource.Form);

        let shipmentXml: string = '';

        const shipmentHeaderTab = formShipment.shipmentHeader.tab;

        let shipmentXid: string;
        let carrierXid: string;

        if (shipmentHeaderTab.tabSelected === 0) {
            shipmentXml += shipment.convertShipmentHeaderToXml();
            shipmentXid = shipment.shipmentHeader.shipmentXid;
            carrierXid = shipment.shipmentHeader.carrierXid;
        } else {
            shipmentXml += shipmentHeaderTab.xmlContent;
            shipmentXid = ShipmentHeader.getShipmentXidFromXml(shipmentXml);
            carrierXid = ShipmentHeader.getCarrierXidFromXml(shipmentXml);
        }

        shipmentXml += "\n";

        const shipmentHeader2Tab = formShipment.shipmentHeader2.tab;

        let shipmentPerspective: string;

        if (shipmentHeader2Tab.tabSelected === 0) {
            shipmentXml += shipment.convertShipmentHeader2ToXml();
            shipmentPerspective = shipment.shipmentHeader2.perspective;
        } else {
            shipmentXml += shipmentHeader2Tab.xmlContent;
            shipmentPerspective = ShipmentHeader2.getPerspectiveFromXml(shipmentXml);
        }

        shipmentXml += "\n";

        const shipmentStopTab = formShipment.shipmentStop.tab;

        if (shipmentStopTab.tabSelected === 0) {
            shipmentXml += shipment.convertShipmentStopToXml();
        } else {
            shipmentXml += shipmentStopTab.xmlContent;
        }

        shipmentXml += "\n";

        const shipmentLocationTab = formShipment.location.tab;

        if (shipmentLocationTab.tabSelected === 0) {
            shipmentXml += shipment.convertLocationToXml();
        } else {
            shipmentXml += shipmentLocationTab.xmlContent;
        }

        shipmentXml += "\n";

        const shipmentReleaseTab = formShipment.release.tab;

        if (shipmentReleaseTab.tabSelected === 0) {
            shipmentXml += shipment.convertReleaseToXml(shipmentXid, shipmentPerspective, carrierXid);
        } else {
            shipmentXml += shipmentReleaseTab.xmlContent;
        }

        shipmentXml += "\n";

        return shipmentXml;
    }

    public convertNFeFormToXml(formNFe: any): NFesAndId {

        if (!this.configuration) return new NFesAndId('', '');

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

    public sendXmlsToWS(form: FormGroup, entitiesTypes: EntityType[], configs: Configs): void {

        let xmlsToSend: SendRequest[] = [];

        if (form.controls['entities'].value) {

            for (let index = 0; index < entitiesTypes.length; index++) {

                const formValue = form.controls['entities'].value[index];

                const entityType = entitiesTypes[index];

                switch (entityType) {

                    case EntityType.Shipment:

                        const shipmentXml: string = this.convertShipmentFormToXml(formValue[0]);

                        const currentTime = new Date();

                        const gLogDate: string = String(currentTime.getFullYear()) +
                            String(currentTime.getMonth()).padStart(2, '0') +
                            String(currentTime.getDate()).padStart(2, '0') +
                            String(currentTime.getHours()).padStart(2, '0') +
                            String(currentTime.getMinutes()).padStart(2, '0') +
                            String(currentTime.getSeconds()).padStart(2, '0');

                        let finalShipmentXml: string = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
            <Transmission xmlns="http://xmlns.oracle.com/apps/otm/transmission/v6.4">
                <otm:TransmissionHeader xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4"
                    xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
                    <otm:Version>20a</otm:Version>
                    <otm:TransmissionCreateDt>
                        <otm:GLogDate>${gLogDate}</otm:GLogDate>
                        <otm:TZId>UTC</otm:TZId>
                        <otm:TZOffset>+00:00</otm:TZOffset>
                    </otm:TransmissionCreateDt>
                    <otm:TransactionCount>1</otm:TransactionCount>
                    <otm:SenderHostName>https://otmgtm-test-a507789.otm.us2.oraclecloud.com:443</otm:SenderHostName>
                    <otm:SenderSystemID>https://otmgtm-test-a507789.otm.us2.oraclecloud.com:443</otm:SenderSystemID>
                    <otm:SenderTransmissionNo>328969</otm:SenderTransmissionNo>
                    <otm:ReferenceTransmissionNo>0</otm:ReferenceTransmissionNo>
                    <otm:GLogXMLElementName>PlannedShipment</otm:GLogXMLElementName>
                    <otm:NotifyInfo>
                        <otm:ContactGid>
                            <otm:Gid>
                                <otm:DomainName>EMBDEV</otm:DomainName>
                                <otm:Xid>TEST</otm:Xid>
                            </otm:Gid>
                        </otm:ContactGid>
                        <otm:ExternalSystemGid>
                            <otm:Gid>
                                <otm:DomainName>EMBDEV</otm:DomainName>
                                <otm:Xid>TEST</otm:Xid>
                            </otm:Gid>
                        </otm:ExternalSystemGid>
                    </otm:NotifyInfo>
                </otm:TransmissionHeader>
                <TransmissionBody>
                    <GLogXMLElement>
                        <otm:TransactionHeader xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4" xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
                        <otm:SenderTransactionId>70352</otm:SenderTransactionId>
                        <otm:SendReason>
                            <otm:Remark>
                                <otm:RemarkSequence>1</otm:RemarkSequence>
                                <otm:RemarkQualifierGid>
                                    <otm:Gid>
                                        <otm:Xid>QUERY TYPE</otm:Xid>
                                    </otm:Gid>
                                </otm:RemarkQualifierGid>
                                <otm:RemarkText>SHIPMENT</otm:RemarkText>
                            </otm:Remark>
                            <otm:SendReasonGid>
                                <otm:Gid>
                                    <otm:Xid>SEND INTEGRATION</otm:Xid>
                                </otm:Gid>
                            </otm:SendReasonGid>
                            <otm:ObjectType>SHIPMENT</otm:ObjectType>
                        </otm:SendReason>
                    </otm:TransactionHeader>
                        <otm:PlannedShipment xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4"
                            xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
                            <otm:Shipment>
                                [[Shipment]]
                            </otm:Shipment>
                        </otm:PlannedShipment>
                    </GLogXMLElement>
                </TransmissionBody>
            </Transmission>
        </soapenv:Body>
    </soapenv:Envelope>`.replace('[[Shipment]]', shipmentXml);

                        xmlsToSend.push(new SendRequest(finalShipmentXml, entityType, configs));

                        break;

                    case EntityType.NFe:

                        const NFeXmlAndId: NFesAndId = this.convertNFeFormToXml(formValue[0]);

                        let finalNFeXml: string = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ndd="http://nddigital.com.br/">
   <soapenv:Header/>
   <soapenv:Body>
      <ndd:Send>
         <!--Optional:-->
         <ndd:header><![CDATA[<CrosstalkMessage>
           <CrosstalkHeader>
            <ProcessCode>6002</ProcessCode>
            <MessageType>100</MessageType>
            <ExchangePattern>7</ExchangePattern>
            <EnterpriseId>[[EnterpriseId]]</EnterpriseId>
            <Token>[[Token]]</Token> 
            <ContentEncoding>utf-8</ContentEncoding>
            <ContentType>text/xml</ContentType>
          </CrosstalkHeader>
         </CrosstalkMessage>]]></ndd:header>
         <!--Optional:-->
         <ndd:rawdata><![CDATA[<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
	<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
		<infNFe Id="NFe[[NFeId]]" versao="4.00">
        [[NFe]]
        </infNFe>
		<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
			<SignedInfo>
				<CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
				<SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
				<Reference URI="#NFe35191031570067000276550030000280551539008390">
					<Transforms>
						<Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
						<Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
					</Transforms>
					<DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
					<DigestValue>0kYR4govwiklUckRyB+bPLlDC2M=</DigestValue>
				</Reference>
			</SignedInfo>
			<SignatureValue>mHgSBnsjMDL70rpB5DsF4KOi1pqaAuKonhUdnAzzhqTsAOv7EBMo92mbrDXhKJqBJTL7Q2Rbr0LShqKLkJjdPHY1IeioDwi4c0dSvrxh9WQ6DKKVFaUfknJ7zUwverJBLRd3teAGPq1j+509aV984JJ7EhKHJH8D7fbZH1y0MLTHZ+9x1RFc7WpF/63J3hFLyXmNoewM9UmSLZkECsDBRi4+z0GOFNBG7TD8G0hrZ7m6KnxIE4aF4vG6VuLHaMpIq8kZWO2TMo3Wq7yyC9kLWCa8rQJ9YWRJpPsDvdgwetUdVFzi1h2HINBfpTa87jW4bzhT6rtTRQ3K6S4uN8K6KA==</SignatureValue>
			<KeyInfo>
				<X509Data>
					<X509Certificate>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</X509Certificate>
				</X509Data>
			</KeyInfo>
		</Signature>
	</NFe>
	<protNFe versao="4.00">
		<infProt>
			<tpAmb>1</tpAmb>
			<verAplic>SP_NFE_PL009_V4</verAplic>
			<chNFe>35191031570067000276550030000280551539008390</chNFe>
			<dhRecbto>2019-10-19T22:00:00-03:00</dhRecbto>
			<nProt>135190776789661</nProt>
			<digVal>0kYR4govwiklUckRyB+bPLlDC2M=</digVal>
			<cStat>100</cStat>
			<xMotivo>Autorizado o uso da NF-e</xMotivo>
		</infProt>
	</protNFe>
</nfeProc>]]></ndd:rawdata>
      </ndd:Send>
   </soapenv:Body>
</soapenv:Envelope>`
                            .replace('[[EnterpriseId]]', configs.enterpriseId)
                            .replace('[[Token]]', configs.token)
                            .replace('[[NFeId]]', NFeXmlAndId.id)
                            .replace('[[NFe]]', NFeXmlAndId.nfeXml);

                        xmlsToSend.push(new SendRequest(finalNFeXml, entityType, configs));

                        break;

                    default:
                        break;
                }
            }
        }

        xmlsToSend.forEach(async (sendRequest: SendRequest) => {
            this.sendXml(sendRequest);

            // await this.sleep(this.configuration.timeoutBetweenEachCall * 1000);
        })
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public sendXml(sendRequest: SendRequest): void {

        this.http.post(backendUrl, sendRequest)
            .pipe(
                catchError((httpErrorResponse: HttpErrorResponse) => {
                    alert(`Erro na requisição:\nURL: ${httpErrorResponse.url}\nStatus: ${httpErrorResponse.status} (${httpErrorResponse.error.title})\nErro: ${httpErrorResponse.error.detail}`);
                    return throwError(() => httpErrorResponse.error.detail);
                })
            )
            .subscribe((response: Object) => {
                if (response) {
                    const result: ResultMessage = response as ResultMessage;

                    if (result) {
                        alert(result.Message);
                        return;
                    }
                }

                alert('Ocorreu algo erro na resposta do backend!');
            });
    }

    public addShipmentFromEntity(shipment: Shipment): any {

        const shipmentHeaderXml = shipment.convertShipmentHeaderToXml();
        const shipmentHeader2Xml = shipment.convertShipmentHeader2ToXml();
        const shipmentStopXml = shipment.convertShipmentStopToXml();
        const shipmentLocationXml = shipment.convertLocationToXml();
        const shipmentReleaseXml = shipment.convertReleaseToXmlByShipment();

        let newFormShipment: any = {
            shipmentHeader: {
                tab: {
                    inputContent: {
                        emissionStatus: shipment.shipmentHeader.emissionStatus,
                        shipmentCarrier: {
                            domainName: shipment.shipmentHeader.carrierDomainName,
                            xid: shipment.shipmentHeader.carrierXid
                        },
                        shipmentCost: {
                            acessorialCost: shipment.shipmentHeader.cost.acessorialCosts,
                            baseCost: shipment.shipmentHeader.cost.baseCost,
                            totalCost: shipment.shipmentHeader.cost.totalCost
                        },
                        shipmentDomainName: shipment.shipmentHeader.shipmentDomainName,
                        shipmentRefnums: {
                            Refnums: [{}],
                        },
                        shipmentTaker: shipment.shipmentHeader.taker,
                        shipmentXid: shipment.shipmentHeader.shipmentXid,
                        travelStatus: shipment.shipmentHeader.travelStatus
                    },
                    tabSelected: 0,
                    xmlContent: shipmentHeaderXml
                }
            },
            shipmentHeader2: {
                tab: {
                    inputContent: {
                        perspective: shipment.shipmentHeader2.perspective
                    },
                    tabSelected: 0,
                    xmlContent: shipmentHeader2Xml
                }
            },
            shipmentStop: {
                tab: {
                    inputContent: {
                        stops: [{}]
                    },
                    tabSelected: 0,
                    xmlContent: shipmentStopXml
                }
            },
            location: {
                tab: {
                    inputContent: {
                        locations: [{}]
                    },
                    tabSelected: 0,
                    xmlContent: shipmentLocationXml
                }
            },
            release: {
                tab: {
                    inputContent: {
                        Releases: [{}]
                    },
                    tabSelected: 0,
                    xmlContent: shipmentReleaseXml
                }
            }
        };

        const newShipmentHeaderRefnums = newFormShipment.shipmentHeader.tab.inputContent.shipmentRefnums.Refnums;

        newShipmentHeaderRefnums.pop();

        shipment.shipmentHeader.refnums.forEach((refnum: Refnum) => {
            newShipmentHeaderRefnums.push({
                domainName: refnum.domainName,
                xid: refnum.xid,
                refnumValue: refnum.refnumValue,
            })
        });

        const newShipmentStops = newFormShipment.shipmentStop.tab.inputContent.stops;

        newShipmentStops.pop();

        shipment.stops.forEach((stop: ShipmentStop) => {
            newShipmentStops.push({
                locationDomainName: stop.locationDomainName,
                locationXid: stop.locationXid,
                stopSequence: stop.stopSequence,
                stopType: stop.stopType,
            })
        });

        const newShipmentLocations = newFormShipment.location.tab.inputContent.locations;

        newShipmentLocations.pop();

        shipment.locations.forEach((location: Location) => {

            const newLocation = {
                location: {
                    domainName: location.domainName,
                    xid: location.xid,
                    city: location.city,
                    uf: location.uf,
                    refnums: {
                        Refnums: [{}]
                    }
                }
            };

            const newLocationRefnums = newLocation.location.refnums.Refnums;

            newLocationRefnums.pop();

            location.refnums.forEach((refnum: Refnum) => {
                newLocationRefnums.push({
                    domainName: refnum.domainName,
                    xid: refnum.xid,
                    refnumValue: refnum.refnumValue,
                });
            });

            newShipmentLocations.push(newLocation);
        });

        const newShipmentReleases = newFormShipment.release.tab.inputContent.Releases;

        newShipmentReleases.pop();

        shipment.releases.forEach((release: Release) => {

            const newRelease = {
                release: {
                    releaseDomainName: release.domainName,
                    releaseXid: release.xid,
                    shipFrom: release.shipFrom,
                    shipTo: release.shipTo,
                    taker: release.taker,
                    orderMovement: {
                        Movements: [{}]
                    },
                    refnums: {
                        Refnums: [{}]
                    },
                    releaseCost: {
                        acessorialCost: [{}],
                        baseCost: "",
                        totalCost: ""
                    }
                }
            };

            const newReleaseOrderMovements = newRelease.release.orderMovement.Movements;

            newReleaseOrderMovements.pop();

            release.orderMovements.forEach((movement: OrderMovement) => {
                newReleaseOrderMovements.push({
                    shipFrom: movement.shipFrom,
                    shipTo: movement.shipTo,
                });
            });

            const newReleaseRefnums = newRelease.release.refnums.Refnums;

            newReleaseRefnums.pop();

            if (release.refnums) {
                release.refnums.forEach((refnum: Refnum) => {
                    newReleaseRefnums.push({
                        domainName: refnum.domainName,
                        xid: refnum.xid,
                        refnumValue: refnum.refnumValue,
                    });
                });
            }

            const newReleaseCost = newRelease.release.releaseCost;

            newReleaseCost.acessorialCost.pop();

            if (release.cost) {
                const releaseCost = release.cost;
                newReleaseCost.baseCost = releaseCost.baseCost;
                newReleaseCost.totalCost = releaseCost.totalCost;
            }

            newShipmentReleases.push(newRelease);
        });

        return newFormShipment;
    }

    public getShipmentDefaultFormValues(): any {
        return {
            shipmentHeader: {
                tab: {
                    inputContent: {
                        emissionStatus: "PRE_EMISSAO_ENVIADA",
                        shipmentCarrier: {
                            domainName: "EMBDEV",
                            xid: "CAR-12521"
                        },
                        shipmentCost: {
                            acessorialCost: "",
                            baseCost: "100",
                            totalCost: "100"
                        },
                        shipmentDomainName: "EMBDEV",
                        shipmentRefnums: {
                            Refnums: [
                                {
                                    domainName: "EMBDEV",
                                    xid: "CLL_IMPOSTO_SOMADO",
                                    refnumValue: "S"
                                },
                                {
                                    domainName: "EMBDEV",
                                    xid: "CLL_IMPOSTO_INCLUSO",
                                    refnumValue: "S"
                                }
                            ]
                        },
                        shipmentTaker: "ORG-8027-30018",
                        shipmentXid: "EMBARQUE1",
                        travelStatus: "PLANEJADO"
                    },
                    tabSelected: 0,
                    xmlContent: ShipmentBaseTag.ShipmentHeader
                }
            },
            shipmentHeader2: {
                tab: {
                    inputContent: {
                        perspective: "Buy"
                    },
                    tabSelected: 0,
                    xmlContent: ShipmentBaseTag.ShipmentHeader2
                }
            },
            shipmentStop: {
                tab: {
                    inputContent: {
                        stops: [
                            {
                                locationDomainName: "EMBDEV",
                                locationXid: "LOCATION7",
                                stopSequence: 1,
                                stopType: "Coleta"
                            },
                            {
                                locationDomainName: "EMBDEV",
                                locationXid: "ORG-8027-30018",
                                stopSequence: 2,
                                stopType: "Entrega"
                            }
                        ]
                    },
                    tabSelected: 0,
                    xmlContent: ShipmentBaseTag.ShipmentStop
                }
            },
            location: {
                tab: {
                    inputContent: {
                        locations: [
                            {
                                location: {
                                    domainName: "EMBDEV",
                                    xid: "CAR-12521",
                                    city: "SAO PAULO",
                                    uf: "SP",
                                    refnums: {
                                        Refnums: [
                                            {
                                                domainName: "EMBDEV",
                                                xid: "CLL_CNPJ",
                                                refnumValue: "00720785000177"
                                            },
                                            {
                                                domainName: "EMBDEV",
                                                xid: "CLL_CODIGO_IBGE",
                                                refnumValue: "3550308"
                                            },
                                            {
                                                domainName: "EMBDEV",
                                                xid: "CLL_TIPO_TRANSPORTADOR",
                                                refnumValue: "ETC_NORMAL"
                                            },
                                        ]
                                    }
                                }
                            },
                            {
                                location: {
                                    domainName: "EMBDEV",
                                    xid: "LOCATION7",
                                    city: "SAO PAULO",
                                    uf: "SP",
                                    refnums: {
                                        Refnums: [
                                            {
                                                domainName: "EMBDEV",
                                                xid: "CLL_CNPJ",
                                                refnumValue: "96973902000183"
                                            },
                                            {
                                                domainName: "EMBDEV",
                                                xid: "CLL_CODIGO_IBGE",
                                                refnumValue: "3550308"
                                            },
                                            {
                                                domainName: "EMBDEV",
                                                xid: "CLL_RAZAO_SOCIAL",
                                                refnumValue: "GALPAO"
                                            },
                                        ]
                                    }
                                }
                            },
                            {
                                location: {
                                    domainName: "EMBDEV",
                                    xid: "ORG-8027-30018",
                                    city: "LAGES",
                                    uf: "SC",
                                    refnums: {
                                        Refnums: [
                                            {
                                                domainName: "EMBDEV",
                                                xid: "CLL_CNPJ",
                                                refnumValue: "05257045000160"
                                            },
                                            {
                                                domainName: "EMBDEV",
                                                xid: "CLL_CODIGO_IBGE",
                                                refnumValue: "4209300"
                                            },
                                            {
                                                domainName: "EMBDEV",
                                                xid: "CLL_RAZAO_SOCIAL",
                                                refnumValue: "MATRIZ 12"
                                            },
                                        ]
                                    }
                                }
                            },

                        ]
                    },
                    tabSelected: 0,
                    xmlContent: ShipmentBaseTag.Location
                }
            },
            release: {
                tab: {
                    inputContent: {
                        Releases: [{
                            release: {
                                releaseDomainName: "EMBDEV",
                                releaseXid: "ORDEM1",
                                shipFrom: "LOCATION7",
                                shipTo: "ORG-8027-30018",
                                taker: "ORG-8027-30018",
                                orderMovement: {
                                    Movements: [{
                                        shipFrom: "LOCATION7",
                                        shipTo: "ORG-8027-30018",
                                    }],
                                },
                                refnums: "",
                                releaseCost: ""
                            }
                        }]
                    },
                    tabSelected: 0,
                    xmlContent: ShipmentBaseTag.Release
                }
            }

        };
    }

    public getNewShipmentByExistent(existentShipment: any): any {

        //ShipmentHeader
        const shipmentHeaderTab = existentShipment.shipmentHeader.tab;

        const shipmentHeaderContent = shipmentHeaderTab.inputContent;

        const shipmentHeaderCarrier = shipmentHeaderContent.shipmentCarrier;

        const shipmentHeaderCost = shipmentHeaderContent.shipmentCost;

        //ShipmentHeader2
        const shipmentHeader2Tab = existentShipment.shipmentHeader2.tab;

        const shipmentHeader2Content = shipmentHeader2Tab.inputContent;

        //ShipmentStop
        const shipmentStopTab = existentShipment.shipmentStop.tab;

        const shipmentStopContent = shipmentStopTab.inputContent;

        //Location
        const shipmentLocationTab = existentShipment.location.tab;

        const shipmentLocationContent = shipmentLocationTab.inputContent;

        //Release
        const shipmentReleaseTab = existentShipment.release.tab;

        const shipmentReleaseContent = shipmentReleaseTab.inputContent;

        const newShipment = {
            shipmentHeader: {
                tab: {
                    inputContent: {
                        emissionStatus: shipmentHeaderContent.emissionStatus,
                        shipmentCarrier: {
                            domainName: shipmentHeaderCarrier.domainName,
                            xid: shipmentHeaderCarrier.xid
                        },
                        shipmentCost: {
                            acessorialCost: shipmentHeaderCost.acessorialCost,
                            baseCost: shipmentHeaderCost.baseCost,
                            totalCost: shipmentHeaderCost.totalCost
                        },
                        shipmentDomainName: shipmentHeaderContent.shipmentDomainName,
                        shipmentRefnums: {
                            Refnums: [{}],
                        },
                        shipmentTaker: shipmentHeaderContent.shipmentTaker,
                        shipmentXid: shipmentHeaderContent.shipmentXid,
                        travelStatus: shipmentHeaderContent.travelStatus
                    },
                    tabSelected: shipmentHeaderTab.tabSelected,
                    xmlContent: shipmentHeaderTab.xmlContent
                }
            },
            shipmentHeader2: {
                tab: {
                    inputContent: {
                        perspective: shipmentHeader2Content.perspective
                    },
                    tabSelected: shipmentHeader2Tab.tabSelected,
                    xmlContent: shipmentHeader2Tab.xmlContent
                }
            },
            shipmentStop: {
                tab: {
                    inputContent: {
                        stops: [{}]
                    },
                    tabSelected: shipmentHeader2Tab.tabSelected,
                    xmlContent: shipmentHeader2Tab.xmlContent
                }
            },
            location: {
                tab: {
                    inputContent: {
                        locations: [{}]
                    },
                    tabSelected: shipmentLocationTab.tabSelected,
                    xmlContent: shipmentLocationTab.xmlContent
                }
            },
            release: {
                tab: {
                    inputContent: {
                        Releases: [{}]
                    },
                    tabSelected: shipmentReleaseTab.tabSelected,
                    xmlContent: shipmentReleaseTab.xmlContent
                }
            }
        };

        const newShipmentHeaderRefnums = newShipment.shipmentHeader.tab.inputContent.shipmentRefnums.Refnums;

        newShipmentHeaderRefnums.pop();

        shipmentHeaderContent.shipmentRefnums.Refnums.forEach((refnum: any) => {
            newShipmentHeaderRefnums.push({
                domainName: refnum.domainName,
                xid: refnum.xid,
                refnumValue: refnum.refnumValue,
            })
        });

        const newShipmentStops = newShipment.shipmentStop.tab.inputContent.stops;

        newShipmentStops.pop();

        shipmentStopContent.stops.forEach((stop: any) => {
            newShipmentStops.push({
                locationDomainName: stop.locationDomainName,
                locationXid: stop.locationXid,
                stopSequence: stop.stopSequence,
                stopType: stop.stopType,
            })
        });

        const newShipmentLocations = newShipment.location.tab.inputContent.locations;

        newShipmentLocations.pop();

        shipmentLocationContent.locations.forEach((contentLocation: any) => {

            const location = contentLocation.location;

            const newLocation = {
                location: {
                    domainName: location.domainName,
                    xid: location.xid,
                    city: location.city,
                    uf: location.uf,
                    refnums: {
                        Refnums: [{}]
                    }
                }
            };

            const newLocationRefnums = newLocation.location.refnums.Refnums;

            newLocationRefnums.pop();

            location.refnums.Refnums.forEach((refnum: any) => {
                newLocationRefnums.push({
                    domainName: refnum.domainName,
                    xid: refnum.xid,
                    refnumValue: refnum.refnumValue,
                });
            });

            newShipmentLocations.push(newLocation);
        });

        const newShipmentReleases = newShipment.release.tab.inputContent.Releases;

        newShipmentReleases.pop();

        shipmentReleaseContent.Releases.forEach((contentRelease: any) => {

            const release = contentRelease.release;

            const newRelease = this.getNewReleaseConsideringCost(release);

            const newReleaseOrderMovements = newRelease.release.orderMovement.Movements;

            newReleaseOrderMovements.pop();

            release.orderMovement.Movements.forEach((movement: any) => {
                newReleaseOrderMovements.push({
                    shipFrom: movement.shipFrom,
                    shipTo: movement.shipTo,
                });
            });

            const newReleaseRefnums = newRelease.release.refnums.Refnums;

            newReleaseRefnums.pop();

            if (release.refnums) {
                release.refnums.Refnums.forEach((refnum: any) => {
                    newReleaseRefnums.push({
                        domainName: refnum.domainName,
                        xid: refnum.xid,
                        refnumValue: refnum.refnumValue,
                    });
                });
            }

            newShipmentReleases.push(newRelease);
        });

        return newShipment;
    }


    private getNewReleaseConsideringCost(release: any): any {

        if (!release.releaseCost) {
            return {
                release: {
                    releaseDomainName: release.releaseDomainName,
                    releaseXid: release.releaseXid,
                    shipFrom: release.shipFrom,
                    shipTo: release.shipTo,
                    taker: release.taker,
                    orderMovement: {
                        Movements: [{}]
                    },
                    refnums: {
                        Refnums: [{}]
                    },
                    releaseCost: ""
                }
            }
        }

        const releaseWithCost = {
            release: {
                releaseDomainName: release.releaseDomainName,
                releaseXid: release.releaseXid,
                shipFrom: release.shipFrom,
                shipTo: release.shipTo,
                taker: release.taker,
                orderMovement: {
                    Movements: [{}]
                },
                refnums: {
                    Refnums: [{}]
                },
                releaseCost: {
                    acessorialCost: [{}],
                    baseCost: "",
                    totalCost: ""
                }
            }
        };

        const newReleaseCost = releaseWithCost.release.releaseCost;

        newReleaseCost.acessorialCost.pop();

        if (release.releaseCost) {
            const releaseCost = release.releaseCost;
            newReleaseCost.baseCost = releaseCost.baseCost;
            newReleaseCost.acessorialCost = releaseCost.acessorialCost;
            newReleaseCost.totalCost = releaseCost.totalCost;
        }

        return releaseWithCost;
    }

    public addNFeFromEntity(nfe: NFe): any {
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

    public getNFeDefaultFormValues(): any {
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

    public getNewNFeByExistent(existentNFe: any): any {

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

    public getConfigurationFromFile(): void {
        this.http.get('./assets/values-configuration.json').subscribe(configurationData => {
            if (configurationData) {
                this.configuration = configurationData as ValuesConfiguration;
            }
        });
    }
}