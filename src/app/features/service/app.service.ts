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

        if (shipmentHeaderTab.tabSelected === 0) {
            shipmentXml += shipment.convertShipmentHeaderToXml();
        } else {
            shipmentXml += shipmentHeaderTab.xmlContent;
        }

        let finalXml: string = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">
    <soapenv:Header />
    <soapenv:Body>
        <Transmission xmlns="http://xmlns.oracle.com/apps/otm/transmission/v6.4">
            <TransmissionHeader xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4"
                xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
                <Version>20a</Version>
                <TransmissionCreateDt>
                    <GLogDate>${gLogDate}</GLogDate>
                    <TZId>UTC</TZId>
                    <TZOffset>+00:00</TZOffset>
                </TransmissionCreateDt>
                <TransactionCount>1</TransactionCount>
                <SenderHostName>https://otmgtm-test-a507789.otm.us2.oraclecloud.com:443</SenderHostName>
                <SenderSystemID>https://otmgtm-test-a507789.otm.us2.oraclecloud.com:443</SenderSystemID>
                <SenderTransmissionNo>328969</SenderTransmissionNo>
                <ReferenceTransmissionNo>0</ReferenceTransmissionNo>
                <GLogXMLElementName>PlannedShipment</GLogXMLElementName>
                <NotifyInfo>
                    <ContactGid>
                        <Gid>
                            <DomainName>EMBDEV</DomainName>
                            <Xid>TEST</Xid>
                        </Gid>
                    </ContactGid>
                    <ExternalSystemGid>
                        <Gid>
                            <DomainName>EMBDEV</DomainName>
                            <Xid>TEST</Xid>
                        </Gid>
                    </ExternalSystemGid>
                </NotifyInfo>
            </TransmissionHeader>
            <TransmissionBody>
                <GLogXMLElement>
                    <TransactionHeader
                        xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4"
                        xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
                        <SenderTransactionId>710385</SenderTransactionId>
                        <ObjectModInfo>
                            <InsertDt>
                                <GLogDate>${gLogDate}</GLogDate>
                                <TZId>UTC</TZId>
                                <TZOffset>+00:00</TZOffset>
                            </InsertDt>
                            <UpdateDt>
                                <GLogDate>${gLogDate}</GLogDate>
                                <TZId>UTC</TZId>
                                <TZOffset>+00:00</TZOffset>
                            </UpdateDt>
                        </ObjectModInfo>
                        <SendReason>
                            <Remark>
                                <RemarkSequence>1</RemarkSequence>
                                <RemarkQualifierGid>
                                    <Gid>
                                        <Xid>QUERY TYPE</Xid>
                                    </Gid>
                                </RemarkQualifierGid>
                                <RemarkText>SHIPMENT</RemarkText>
                            </Remark>
                            <SendReasonGid>
                                <Gid>
                                    <Xid>SEND INTEGRATION</Xid>
                                </Gid>
                            </SendReasonGid>
                            <ObjectType>SHIPMENT</ObjectType>
                        </SendReason>
                    </TransactionHeader>
                    <PlannedShipment xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4"
                        xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
                        <Shipment>
                            [[Shipment]]
                        </Shipment>
                    </PlannedShipment>
                </GLogXMLElement>
            </TransmissionBody>
        </Transmission>
    </soapenv:Body>
</soapenv:Envelope>`;

        return finalXml;
    }
}