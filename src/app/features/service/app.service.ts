import { FormGroup } from "@angular/forms";
import { Cost, Location, Release, Shipment, ShipmentHeader, ShipmentHeader2, ShipmentStop } from "../../model/shipment";

export class AppService {

    public convertFormToXml(form: FormGroup): string {

        const shipment: Shipment = new Shipment(form);

        const currentTime = new Date();

        const gLogDate: string = String(currentTime.getFullYear()) +
            String(currentTime.getMonth()).padStart(2, '0') +
            String(currentTime.getDate()).padStart(2, '0') +
            String(currentTime.getHours()).padStart(2, '0') +
            String(currentTime.getMinutes()).padStart(2, '0') +
            String(currentTime.getSeconds()).padStart(2, '0');

        let shipmentXml: string = '';

        const shipmentHeaderTab = form.controls['shipmentHeader'].value.tab;

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

        const shipmentHeader2Tab = form.controls['shipmentHeader2'].value.tab;

        let shipmentPerspective: string;

        if (shipmentHeader2Tab.tabSelected === 0) {
            shipmentXml += shipment.convertShipmentHeader2ToXml();
            shipmentPerspective = shipment.shipmentHeader2.perspective;
        } else {
            shipmentXml += shipmentHeader2Tab.xmlContent;
            shipmentPerspective = ShipmentHeader2.getPerspectiveFromXml(shipmentXml);
        }

        shipmentXml += "\n";

        const shipmentStopTab = form.controls['shipmentStop'].value.tab;

        if (shipmentStopTab.tabSelected === 0) {
            shipmentXml += shipment.convertShipmentStopToXml();
        } else {
            shipmentXml += shipmentStopTab.xmlContent;
        }

        shipmentXml += "\n";

        const shipmentLocationTab = form.controls['location'].value.tab;

        if (shipmentLocationTab.tabSelected === 0) {
            shipmentXml += shipment.convertLocationToXml();
        } else {
            shipmentXml += shipmentLocationTab.xmlContent;
        }

        shipmentXml += "\n";

        const shipmentReleaseTab = form.controls['release'].value.tab;

        if (shipmentReleaseTab.tabSelected === 0) {
            shipmentXml += shipment.convertReleaseToXml(shipmentXid, shipmentPerspective, carrierXid);
        } else {
            shipmentXml += shipmentReleaseTab.xmlContent;
        }

        shipmentXml += "\n";

        let finalXml: string = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">
    <soapenv:Header />
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
                    <otm:TransactionHeader
                        xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4"
                        xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
                        <otm:SenderTransactionId>710385</otm:SenderTransactionId>
                        <otm:ObjectModInfo>
                            <otm:InsertDt>
                                <otm:GLogDate>${gLogDate}</otm:GLogDate>
                                <otm:TZId>UTC</otm:TZId>
                                <otm:TZOffset>+00:00</otm:TZOffset>
                            </otm:InsertDt>
                            <otm:UpdateDt>
                                <otm:GLogDate>${gLogDate}</otm:GLogDate>
                                <otm:TZId>UTC</otm:TZId>
                                <otm:TZOffset>+00:00</otm:TZOffset>
                            </otm:UpdateDt>
                        </otm:ObjectModInfo>
                        <otm:SendReason>
                            <otm:Remark>
                                <otm:RemarkSequence>1</otm:RemarkSequence>
                                <otm:RemarkQualifierGid>
                                    <otm:Gid>
                                        <otm:Xid>QUERY TYPE</otm:Xid>
                                    <otm:/otm:Gid>
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
                </otm:GLogXMLElement>
            </otm:TransmissionBody>
        </Transmission>
    </soapenv:Body>
</soapenv:Envelope>`.replace('[[Shipment]]', shipmentXml);



        return finalXml;
    }
}