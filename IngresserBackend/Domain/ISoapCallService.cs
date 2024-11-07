namespace IngresserBackend.Domain
{
    public interface ISoapCallService
    {
        Task CallShipmentWebService(SoapRequest soapRequest);

        Task CallDocumentWebService(SoapRequest soapRequest);
    }
}
