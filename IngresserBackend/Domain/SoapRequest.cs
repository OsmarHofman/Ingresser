namespace IngresserBackend.Domain
{
    public class SoapRequest
    {

        public required string Url { get; set; }

        public required string Xml { get; set; }

        public required bool IsShipment { get; set; }
    }
}
