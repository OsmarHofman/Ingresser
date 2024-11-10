import { FormGroup } from "@angular/forms";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, throwError } from "rxjs";

import { ResultMessage } from "../shared/result-message";
import { Shipment  } from "../../model/shipment";
import { NFesAndId } from "../../model/nfe";
import { ValuesConfiguration } from "../../model/values-configuration";
import { SendRequest } from "../../model/send-request";
import { EntityType } from "../../model/entityType";
import { Configs } from "../../model/configs";

@Injectable()
export class AppService {

    private configuration: ValuesConfiguration = new ValuesConfiguration();

    constructor(private http: HttpClient) {
        this.getConfigurationFromFile();
    }

    public sendXmlsToWS(form: FormGroup, entitiesTypes: EntityType[], configs: Configs): void {

        if (!this.configuration) return ;

        let xmlsToSend: SendRequest[] = [];

        if (form.controls['entities'].value) {

            for (let index = 0; index < entitiesTypes.length; index++) {

                const formValue = form.controls['entities'].value[index];

                const entityType = entitiesTypes[index];

                switch (entityType) {

                    case EntityType.Shipment:

                        const shipmentXml: string = Shipment.convertShipmentFormToXml(formValue[0]);

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

                        const NFeXmlAndId: NFesAndId = NFesAndId.convertNFeFormToXml(formValue[0]);

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

            await this.sleep(this.configuration.timeoutBetweenEachCall * 1000);
        })
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public sendXml(sendRequest: SendRequest): void {

        this.http.post(this.configuration.backendUrl, sendRequest)
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

    public getConfigurationFromFile(): void {
        this.http.get('./assets/values-configuration.json').subscribe(configurationData => {
            if (configurationData) {
                this.configuration = configurationData as ValuesConfiguration;
            } else{
                alert("Erro ao tentar obter configurações do arquivo: values-configuration.json!");
            }
        });
    }
}