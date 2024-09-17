import { FormGroup } from "@angular/forms";
import { Shipment, ShipmentHeader, ShipmentHeader2 } from "../../model/shipment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'ReceiveTransmission'
    })
};

@Injectable()
export class AppService {

    public wsUrl = 'pr.nddfrete.com.br/1046/tmsExchangeMessage/TMSExchangeMessage'

    constructor(private http: HttpClient) {

    }

    public convertFormToXml(form: FormGroup): string {

        const formShipment = form.controls['shipment'].value;

        const shipment: Shipment = new Shipment(formShipment);

        const currentTime = new Date();

        const gLogDate: string = String(currentTime.getFullYear()) +
            String(currentTime.getMonth()).padStart(2, '0') +
            String(currentTime.getDate()).padStart(2, '0') +
            String(currentTime.getHours()).padStart(2, '0') +
            String(currentTime.getMinutes()).padStart(2, '0') +
            String(currentTime.getSeconds()).padStart(2, '0');

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

        let finalXml: string = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tms="http://tempuri.org/tms">
	<soap:Header/>
	<soap:Body>
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
            </otm:TransmissionBody>
        </Transmission>
    </soap:Body>
</soap:Envelope>`.replace('[[Shipment]]', shipmentXml);

        let response = this.http.post(this.wsUrl, finalXml, httpOptions);

        return finalXml;
    }
}