namespace IngresserBackend.Domain
{
    public class SoapRequest
    {

        public required string Url { get; set; }

        public required string Xml { get; set; }
    }
}
