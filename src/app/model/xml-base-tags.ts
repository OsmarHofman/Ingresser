import xmlFormat from 'xml-formatter';

export class ShipmentBaseTag {
    public static ShipmentHeader: string = xmlFormat(`<otm:ShipmentHeader><otm:ShipmentGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>EMBARQUE1</otm:Xid></otm:Gid></otm:ShipmentGid><otm:ShipmentRefnum><otm:ShipmentRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_IMPOSTO_INCLUSO</otm:Xid></otm:Gid></otm:ShipmentRefnumQualifierGid><otm:ShipmentRefnumValue>S</otm:ShipmentRefnumValue></otm:ShipmentRefnum><otm:ShipmentRefnum><otm:ShipmentRefnumQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_IMPOSTO_SOMADO</otm:Xid></otm:Gid></otm:ShipmentRefnumQualifierGid><otm:ShipmentRefnumValue>N</otm:ShipmentRefnumValue></otm:ShipmentRefnum><otm:InternalShipmentStatus><otm:StatusTypeGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_STATUS_EMISSAO</otm:Xid></otm:Gid></otm:StatusTypeGid><otm:StatusValueGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>PRE_EMISSAO_ENVIADA</otm:Xid></otm:Gid></otm:StatusValueGid></otm:InternalShipmentStatus><otm:InternalShipmentStatus><otm:StatusTypeGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_STATUS_VIAGEM</otm:Xid></otm:Gid></otm:StatusTypeGid><otm:StatusValueGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>PLANEJADO</otm:Xid></otm:Gid></otm:StatusValueGid></otm:InternalShipmentStatus><otm:ServiceProviderGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CAR-12521</otm:Xid></otm:Gid></otm:ServiceProviderGid><otm:TotalPlannedCost><otm:FinancialAmount><otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode><otm:MonetaryAmount>100.00</otm:MonetaryAmount></otm:FinancialAmount></otm:TotalPlannedCost><otm:TotalActualCost><otm:FinancialAmount><otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode><otm:MonetaryAmount>100.00</otm:MonetaryAmount></otm:FinancialAmount></otm:TotalActualCost><otm:TotalWeightedCost><otm:FinancialAmount><otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode><otm:MonetaryAmount>100.00</otm:MonetaryAmount></otm:FinancialAmount></otm:TotalWeightedCost><otm:ShipmentCost><otm:ShipmentCostSeqno>167886</otm:ShipmentCostSeqno><otm:CostType>B</otm:CostType><otm:Cost><otm:FinancialAmount><otm:GlobalCurrencyCode>BRL</otm:GlobalCurrencyCode><otm:MonetaryAmount>100.00</otm:MonetaryAmount></otm:FinancialAmount></otm:Cost></otm:ShipmentCost><otm:TransportModeGid><otm:Gid><otm:Xid>TL</otm:Xid></otm:Gid></otm:TransportModeGid><otm:InvolvedParty><otm:TransactionCode>NP</otm:TransactionCode><otm:InvolvedPartyQualifierGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>CLL_TOMADOR</otm:Xid></otm:Gid></otm:InvolvedPartyQualifierGid><otm:InvolvedPartyLocationRef><otm:LocationRef><otm:LocationGid><otm:Gid><otm:DomainName>EMBDEV</otm:DomainName><otm:Xid>ORG-8027-30018</otm:Xid></otm:Gid></otm:LocationGid></otm:LocationRef></otm:InvolvedPartyLocationRef></otm:InvolvedParty></otm:ShipmentHeader>`,
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