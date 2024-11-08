namespace IngresserBackend.Domain
{
    public class SoapRequest
    {
        public required string Xml { get; set; }

        public EntityType EntityType { get; set; }

        public required Configs Configs { get; set; }

        public string GetUrl()
        {
            switch (EntityType)
            {
                case EntityType.Shipment:
                    return $"https://pr.dev.nddfrete.com.br:{Configs.Port}/tmsExchangeMessage/TMSExchangeMessage.asmx";

                case EntityType.NFe:
                    return $"https://pr.dev.nddfrete.com.br:{Configs.Port}/exchangeMessage/WSExchangeMessage.asmx?op=Send";

                default:
                    return string.Empty;
            }
        }

    }

    public enum EntityType
    {
        Shipment,
        NFe
    }

    public class Configs
    {
        public int Port { get; set; }

        public string? EnterpriseId { get; set; }

        public string? Token { get; set; }
    }
}
