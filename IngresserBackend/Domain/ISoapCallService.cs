namespace IngresserBackend.Domain
{
    public interface ISoapCallService
    {
        Task CallShipmentWebService(SoapRequest soapRequest);
    }
}
