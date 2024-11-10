import xmlFormat from 'xml-formatter';
import { Shipment } from './shipment';
import { Configs } from './configs';
import { NFesAndId } from './nfe';

export class ShipmentBaseTag {
    public static ShipmentHeader: string = xmlFormat(`<otm:ShipmentHeader><otm:ShipmentGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>EMBARQUE1</otm:Xid></otm:Gid></otm:ShipmentGid><otm:ShipmentRefnum><otm:ShipmentRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_IMPOSTO_INCLUSO</otm:Xid></otm:Gid></otm:ShipmentRefnumQualifierGid><otm:ShipmentRefnumValue>S</otm:ShipmentRefnumValue></otm:ShipmentRefnum><otm:ShipmentRefnum><otm:ShipmentRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_IMPOSTO_SOMADO</otm:Xid></otm:Gid></otm:ShipmentRefnumQualifierGid><otm:ShipmentRefnumValue>S</otm:ShipmentRefnumValue></otm:ShipmentRefnum><otm:InternalShipmentStatus><otm:StatusTypeGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_STATUS_EMISSAO</otm:Xid></otm:Gid></otm:StatusTypeGid><otm:StatusValueGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>PRE_EMISSAO_ENVIADA</otm:Xid></otm:Gid></otm:StatusValueGid></otm:InternalShipmentStatus><otm:InternalShipmentStatus><otm:StatusTypeGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_STATUS_VIAGEM</otm:Xid></otm:Gid></otm:StatusTypeGid><otm:StatusValueGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>PLANEJADO</otm:Xid></otm:Gid></otm:StatusValueGid></otm:InternalShipmentStatus><otm:ServiceProviderGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CAR-12521</otm:Xid></otm:Gid></otm:ServiceProviderGid><otm:TotalPlannedCost><otm:FinancialAmount><otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode><otm:MonetaryAmount>100.00</otm:MonetaryAmount></otm:FinancialAmount></otm:TotalPlannedCost><otm:TotalActualCost><otm:FinancialAmount><otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode><otm:MonetaryAmount>100.00</otm:MonetaryAmount></otm:FinancialAmount></otm:TotalActualCost><otm:TotalWeightedCost><otm:FinancialAmount><otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode><otm:MonetaryAmount>100.00</otm:MonetaryAmount></otm:FinancialAmount></otm:TotalWeightedCost><otm:ShipmentCost><otm:ShipmentCostSeqno>167886</otm:ShipmentCostSeqno><otm:CostType>B</otm:CostType><otm:Cost><otm:FinancialAmount><otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode><otm:MonetaryAmount>100.00</otm:MonetaryAmount></otm:FinancialAmount></otm:Cost></otm:ShipmentCost><otm:TransportModeGid><otm:Gid><otm:Xid>TL</otm:Xid></otm:Gid></otm:TransportModeGid><otm:InvolvedParty><otm:TransactionCode>NP</otm:TransactionCode><otm:InvolvedPartyQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_TOMADOR</otm:Xid></otm:Gid></otm:InvolvedPartyQualifierGid><otm:InvolvedPartyLocationRef><otm:LocationRef><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>ORG-8027-30018</otm:Xid></otm:Gid></otm:LocationGid></otm:LocationRef></otm:InvolvedPartyLocationRef></otm:InvolvedParty></otm:ShipmentHeader>`,
        { collapseContent: true }
    );

    public static ShipmentHeader2: string = xmlFormat(`<otm:ShipmentHeader2><otm:Perspective>B</otm:Perspective></otm:ShipmentHeader2>`,
        { collapseContent: true }
    );

    public static ShipmentStop: string = xmlFormat(`<Stops><otm:ShipmentStop><otm:StopSequence>1</otm:StopSequence><otm:LocationRef><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>LOCATION7</otm:Xid></otm:Gid></otm:LocationGid></otm:LocationRef><otm:StopType>P</otm:StopType></otm:ShipmentStop><otm:ShipmentStop><otm:StopSequence>2</otm:StopSequence><otm:LocationRef><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>ORG-8027-30018</otm:Xid></otm:Gid></otm:LocationGid></otm:LocationRef><otm:StopType>D</otm:StopType></otm:ShipmentStop></otm:Stops>`,
        { collapseContent: true }
    ).replace(`<Stops>`, '').replace(`</Stops>`, '');

    public static Location: string = xmlFormat(`<Locations><otm:Location><otm:TransactionCode>NP</otm:TransactionCode><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CAR-12521</otm:Xid></otm:Gid></otm:LocationGid><otm:LocationName>TRANSPORTADORA DE CARGAS LTDA - ME</otm:LocationName><otm:IsTemplate>N</otm:IsTemplate><otm:Address><otm:AddressLines><otm:SequenceNumber>1</otm:SequenceNumber><otm:AddressLine>RUA ALTO DA BOA VISTA</otm:AddressLine></otm:AddressLines><otm:City>SAO PAULO</otm:City><otm:Province>SP</otm:Province><otm:ProvinceCode>SP</otm:ProvinceCode><otm:PostalCode>13010-040</otm:PostalCode><otm:CountryCode3Gid><otm:Gid><otm:Xid>BR</otm:Xid></otm:Gid></otm:CountryCode3Gid><otm:CountryCode><otm:CountryCode3Gid><otm:Gid><otm:Xid>BR</otm:Xid></otm:Gid></otm:CountryCode3Gid></otm:CountryCode><otm:TimeZoneGid><otm:Gid><otm:Xid>Brazil/East</otm:Xid></otm:Gid></otm:TimeZoneGid><otm:Latitude>-23.54567</otm:Latitude><otm:Longitude>-46.63357</otm:Longitude></otm:Address><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_BAIRRO</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>SAGRADO01</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_CNPJ</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>00720785000177</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_CODIGO_IBGE</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>3550308</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_NOME_FANTASIA</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>TRANSPORTADORA DE CARGAS LTDA - ME</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_IE</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>SC_84807044</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_NUMERO_LOGRADOURO</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>123</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_TIPO_TRANSPORTADOR</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>ETC_NORMAL</otm:LocationRefnumValue></otm:LocationRefnum></otm:Location><otm:Location><otm:TransactionCode>NP</otm:TransactionCode><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>LOCATION7</otm:Xid></otm:Gid></otm:LocationGid><otm:LocationName>GALPAO EXTERNO</otm:LocationName><otm:IsTemplate>N</otm:IsTemplate><otm:Address><otm:AddressLines><otm:SequenceNumber>1</otm:SequenceNumber><otm:AddressLine>BEM LONGE 177.</otm:AddressLine></otm:AddressLines><otm:City>SAO PAULO</otm:City><otm:Province>SP</otm:Province><otm:ProvinceCode>SP</otm:ProvinceCode><otm:PostalCode>04710-090</otm:PostalCode><otm:CountryCode3Gid><otm:Gid><otm:Xid>BR</otm:Xid></otm:Gid></otm:CountryCode3Gid><otm:CountryCode><otm:CountryCode3Gid><otm:Gid><otm:Xid>BR</otm:Xid></otm:Gid></otm:CountryCode3Gid></otm:CountryCode><otm:TimeZoneGid><otm:Gid><otm:Xid>America/Sao_Paulo</otm:Xid></otm:Gid></otm:TimeZoneGid><otm:Latitude>-22.90794</otm:Latitude><otm:Longitude>-47.06264</otm:Longitude></otm:Address><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_BAIRRO</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>BAIRRO01</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_CNPJ</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>96973902000183</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_CODIGO_IBGE</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>3550308</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_IE</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>SP_123456</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_IM</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>987654</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_NOME_FANTASIA</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>GALPAS</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_NUMERO_LOGRADOURO</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>555</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_RAZAO_SOCIAL</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>GALPAO EXTERNO</otm:LocationRefnumValue></otm:LocationRefnum></otm:Location><otm:Location><otm:TransactionCode>NP</otm:TransactionCode><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>ORG-8027-30018</otm:Xid></otm:Gid></otm:LocationGid><otm:LocationName>MATRIZ 12</otm:LocationName><otm:IsTemplate>N</otm:IsTemplate><otm:Address><otm:AddressLines><otm:SequenceNumber>1</otm:SequenceNumber><otm:AddressLine>RUA DR. JOSE AUREO BUSTAMENTE 455 </otm:AddressLine></otm:AddressLines><otm:City>LAGES</otm:City><otm:Province>SC</otm:Province><otm:ProvinceCode>SC</otm:ProvinceCode><otm:PostalCode>13010-040</otm:PostalCode><otm:CountryCode3Gid><otm:Gid><otm:Xid>BR</otm:Xid></otm:Gid></otm:CountryCode3Gid><otm:CountryCode><otm:CountryCode3Gid><otm:Gid><otm:Xid>BR</otm:Xid></otm:Gid></otm:CountryCode3Gid></otm:CountryCode><otm:TimeZoneGid><otm:Gid><otm:Xid>America/Sao_Paulo</otm:Xid></otm:Gid></otm:TimeZoneGid><otm:Latitude>-23.6258</otm:Latitude><otm:Longitude>-46.69656</otm:Longitude></otm:Address><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_BAIRRO</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>BAIRRO</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_CEP_SOCIO</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>88523-060</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_CNPJ</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>05257045000160</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_CODIGO_IBGE</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>4209300</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_IE</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>ISENTO</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_IM</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>123456</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_NOME_FANTASIA</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>MATRIZ DOZE</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_NUMERO_LOGRADOURO</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>9999</otm:LocationRefnumValue></otm:LocationRefnum><otm:LocationRefnum><otm:LocationRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_RAZAO_SOCIAL</otm:Xid></otm:Gid></otm:LocationRefnumQualifierGid><otm:LocationRefnumValue>MATRIZ 12</otm:LocationRefnumValue></otm:LocationRefnum></otm:Location></Locations>`,
        { collapseContent: true }
    ).replace(`<Locations>`, '').replace(`</Locations>`, '');

    public static Release: string = xmlFormat(`<otm:Release><otm:ReleaseGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>ORDEM1</otm:Xid></otm:Gid></otm:ReleaseGid><otm:ShipFromLocationRef><otm:LocationRef><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>LOCATION7</otm:Xid></otm:Gid></otm:LocationGid></otm:LocationRef></otm:ShipFromLocationRef><otm:ShipToLocationRef><otm:LocationRef><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>ORG-8027-30018</otm:Xid></otm:Gid></otm:LocationGid></otm:LocationRef></otm:ShipToLocationRef><otm:InvolvedParty><otm:TransactionCode>NP</otm:TransactionCode><otm:InvolvedPartyQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_TOMADOR</otm:Xid></otm:Gid></otm:InvolvedPartyQualifierGid><otm:InvolvedPartyLocationRef><otm:LocationRef><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>ORG-8027-30018</otm:Xid></otm:Gid></otm:LocationGid></otm:LocationRef></otm:InvolvedPartyLocationRef></otm:InvolvedParty><otm:ReleaseAllocationInfo><otm:ReleaseAllocByType><otm:AllocTypeQualGid><otm:Gid><otm:Xid>PLANNING</otm:Xid></otm:Gid></otm:AllocTypeQualGid><otm:ReleaseAllocShipment><otm:ShipmentGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>EMBARQUE1</otm:Xid></otm:Gid></otm:ShipmentGid><otm:TotalAllocCost><otm:FinancialAmount><otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode><otm:MonetaryAmount>100.0</otm:MonetaryAmount><otm:RateToBase>0.5639521768554027</otm:RateToBase><otm:FuncCurrencyAmount>0.0</otm:FuncCurrencyAmount></otm:FinancialAmount></otm:TotalAllocCost><otm:ReleaseAllocShipmentDetail><otm:Cost><otm:FinancialAmount><otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode><otm:MonetaryAmount>100.0</otm:MonetaryAmount><otm:RateToBase>0.5639521768554027</otm:RateToBase><otm:FuncCurrencyAmount>0.0</otm:FuncCurrencyAmount></otm:FinancialAmount></otm:Cost><otm:CostTypeGid><otm:Gid><otm:Xid>B</otm:Xid></otm:Gid></otm:CostTypeGid><otm:CostDescription>B</otm:CostDescription></otm:ReleaseAllocShipmentDetail></otm:ReleaseAllocShipment></otm:ReleaseAllocByType></otm:ReleaseAllocationInfo><otm:OrderMovement><otm:OrderMovementGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>OMOVEMENT1</otm:Xid></otm:Gid></otm:OrderMovementGid><otm:TransactionCode>NP</otm:TransactionCode><otm:OrderReleaseGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>ORDEM1</otm:Xid></otm:Gid></otm:OrderReleaseGid><otm:Perspective>B</otm:Perspective><otm:ShipFromLocationRef><otm:LocationRef><otm:Location><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>LOCATION7</otm:Xid></otm:Gid></otm:LocationGid></otm:Location></otm:LocationRef></otm:ShipFromLocationRef><otm:ShipToLocationRef><otm:LocationRef><otm:Location><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>ORG-8027-30018</otm:Xid></otm:Gid></otm:LocationGid></otm:Location></otm:LocationRef></otm:ShipToLocationRef><otm:ShipmentGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>EMBARQUE1</otm:Xid></otm:Gid></otm:ShipmentGid></otm:OrderMovement></otm:Release>`,
        { collapseContent: true }
    );
}

export class NFeBaseTag {
    public static Ide: string = xmlFormat(`<ide><cUF>35</cUF><cNF>53900839</cNF><natOp>VENDA ADQUIRIDAS E OU TER</natOp><mod>55</mod><serie>3</serie><nNF>123456</nNF><dhEmi>2019-10-19T21:58:45-02:00</dhEmi><dhSaiEnt>2019-10-19T22:13:50-02:00</dhSaiEnt><tpNF>1</tpNF><idDest>2</idDest><cMunFG>3515004</cMunFG><tpImp>2</tpImp><tpEmis>1</tpEmis><cDV>0</cDV><tpAmb>1</tpAmb><finNFe>1</finNFe><indFinal>0</indFinal><indPres>9</indPres><procEmi>0</procEmi><verProc>SynchroDFe_3.2.4.4</verProc></ide>`,
        { collapseContent: true }
    );

    public static Emit: string = xmlFormat(`<emit><CNPJ>96973902000183</CNPJ><xNome>Emitente da NF-e</xNome><xFant>Fantasia Emitente da NF-e</xFant><enderEmit><xLgr>Rua do Emitente</xLgr><nro>1481</nro><xCpl>Info Complementaria do Logradouro</xCpl><xBairro>Bairro Emitente</xBairro><cMun>3550308</cMun><xMun>SAO PAULO</xMun><UF>SP</UF><CEP>06845070</CEP><cPais>1058</cPais><xPais>BRASIL</xPais></enderEmit><IE>298280913119</IE><CRT>3</CRT></emit>`,
        { collapseContent: true }
    );

    public static Dest: string = xmlFormat(`<dest><CNPJ>05257045000160</CNPJ><xNome>Destinatario da NF-e</xNome><enderDest><xLgr>Rua do Destinatario</xLgr><nro>1003</nro><xBairro>Bairro Destinatario</xBairro><cMun>4209300</cMun><xMun>LAGES</xMun><UF>SC</UF><CEP>32183680</CEP><cPais>1058</cPais><xPais>BRASIL</xPais><fone>2124722123</fone></enderDest><indIEDest>1</indIEDest><IE>3671539868959</IE></dest>`,
        { collapseContent: true }
    );

    public static Retirada: string = xmlFormat(`<retirada><CNPJ>96973902000183</CNPJ><xNome>NOME RETIRADA</xNome><xLgr>LOG RETIRADA</xLgr><nro>100</nro><xBairro>BAIRRO RETIRADA</xBairro><cMun>3550308</cMun><xMun>SAO PAULO</xMun><UF>SP</UF><CEP>32183680</CEP><cPais>1058</cPais><xPais>BRASIL</xPais><fone>2124722123</fone><IE>3671539868959</IE></retirada>`,
        { collapseContent: true }
    );

    public static Entrega: string = xmlFormat(`<entrega><CNPJ>05257045000160</CNPJ><xNome>NOME ENTREGA</xNome><xLgr>LOG ENTREGA</xLgr><nro>100</nro><xBairro>BAIRRO ENTREGA</xBairro><cMun>4209300</cMun><xMun>LAGES</xMun><UF>SC</UF><CEP>32183680</CEP><cPais>1058</cPais><xPais>BRASIL</xPais><fone>2124722123</fone><IE>3671539868959</IE></entrega>`,
        { collapseContent: true }
    );

    public static OtherTags: string = xmlFormat(`<otherTags><autXML><CPF>02634477902</CPF></autXML><autXML><CNPJ>67185306000130</CNPJ></autXML><det nItem="1"><prod><cProd>3041115</cProd><cEAN>27896222720157</cEAN><xProd>JONTX BR PRES LUB FP 48X3</xProd><NCM>40141000</NCM><CEST>1301300</CEST><CFOP>6102</CFOP><uCom>CA</uCom><qCom>1.0000</qCom><vUnCom>214.420000000</vUnCom><vProd>214.42</vProd><cEANTrib>7896222720030</cEANTrib><uTrib>CA</uTrib><qTrib>1.0000</qTrib><vUnTrib>214.420000000</vUnTrib><indTot>1</indTot><nFCI>DB2F7F5D-D281-4B18-8C05-9C7D347EA14D</nFCI></prod><imposto><ICMS><ICMS00><orig>0</orig><CST>00</CST><modBC>3</modBC><vBC>450.00</vBC><pICMS>1.00</pICMS><vICMS>4.50</vICMS></ICMS00></ICMS><IPI><cEnq>999</cEnq><IPINT><CST>53</CST></IPINT></IPI><PIS><PISAliq><CST>01</CST><vBC>214.42</vBC><pPIS>1.6500</pPIS><vPIS>3.54</vPIS></PISAliq></PIS><COFINS><COFINSAliq><CST>01</CST><vBC>214.42</vBC><pCOFINS>7.600</pCOFINS><vCOFINS>16.30</vCOFINS></COFINSAliq></COFINS></imposto><infAdProd>Resolucao do Senado Federal n 13/12, Numero da FCI DB2F7F5D-D281-4B18-8C05-9C7D347EA14D, Percentual da Parcela Importada 0,00%. Valor de ICMS Desonerado R$ 25,73</infAdProd></det><total><ICMSTot><vBC>0.00</vBC><vICMS>0.00</vICMS><vICMSDeson>25.73</vICMSDeson><vFCP>0.00</vFCP><vBCST>0.00</vBCST><vST>0.00</vST><vFCPST>0.00</vFCPST><vFCPSTRet>0.00</vFCPSTRet><vProd>214.42</vProd><vFrete>0.00</vFrete><vSeg>0.00</vSeg><vDesc>0.00</vDesc><vII>0.00</vII><vIPI>0.00</vIPI><vIPIDevol>0.00</vIPIDevol><vPIS>3.54</vPIS><vCOFINS>16.30</vCOFINS><vOutro>0.00</vOutro><vNF>450.00</vNF></ICMSTot></total><transp><modFrete>0</modFrete><transporta><CNPJ>22275067000171</CNPJ><xNome>MAXIMA LOGISTICA TRANSPORTE E SERVICOS L</xNome><IE>0025438380058</IE><xEnder>RUA CONTINENTAL 300</xEnder><xMun>Contagem</xMun><UF>MG</UF></transporta><vol><qVol>1</qVol><esp>CX</esp><pesoL>0.390</pesoL><pesoB>0.610</pesoB></vol></transp><cobr><fat><nFat>006700</nFat><vOrig>188.69</vOrig><vDesc>0.00</vDesc><vLiq>188.69</vLiq></fat><dup><nDup>001</nDup><dVenc>2019-11-23</dVenc><vDup>188.69</vDup></dup></cobr><pag><detPag><tPag>15</tPag><vPag>188.69</vPag></detPag></pag></otherTags>`,
        { collapseContent: true }
    ).replace(`<otherTags>`, '').replace(`</otherTags>`, '');

    public static InfAdic: string = xmlFormat(`<infAdic><infCpl>IDOR|EMBDEV.ORDEM1|IDOR</infCpl></infAdic>`,
        { collapseContent: true }
    );
}

export class SoapTag {

    //#region Shipment
    public static shipmentBaseXml: string = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
<soapenv:Header/>
<soapenv:Body>
<Transmission xmlns="http://xmlns.oracle.com/apps/otm/transmission/v6.4">
<otm:TransmissionHeader xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4"
    xmlns:gtm="http://xmlns.oracle.com/apps/gtm/transmission/v6.4">
    <otm:Version>20a</otm:Version>
    <otm:TransmissionCreateDt>
        <otm:GLogDate>[[GLogDate]]</otm:GLogDate>
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
</soapenv:Envelope>`;

    public static getShipmentXmlByForm(form: any): string {

        const shipmentXml: string = Shipment.convertShipmentFormToXml(form);

        const currentTime = new Date();

        const gLogDate: string = String(currentTime.getFullYear()) +
            String(currentTime.getMonth()).padStart(2, '0') +
            String(currentTime.getDate()).padStart(2, '0') +
            String(currentTime.getHours()).padStart(2, '0') +
            String(currentTime.getMinutes()).padStart(2, '0') +
            String(currentTime.getSeconds()).padStart(2, '0');

        let finalShipmentXml: string = this.shipmentBaseXml.replace('[[GLogDate]]', gLogDate)
            .replace('[[Shipment]]', shipmentXml);

        return finalShipmentXml;
    }

    //#endregion

    //#region NF-e

    public static nfeBaseXml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ndd="http://nddigital.com.br/">
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
</soapenv:Envelope>`;

    public static getNFeXmlByForm(configs: Configs, nfeXmlAndId: NFesAndId): string {

        const finalNFeXml: string = this.nfeBaseXml.replace('[[EnterpriseId]]', configs.enterpriseId)
            .replace('[[Token]]', configs.token)
            .replace('[[NFeId]]', nfeXmlAndId.id)
            .replace('[[NFe]]', nfeXmlAndId.nfeXml);

        return finalNFeXml;
    }

    //#endregion
}