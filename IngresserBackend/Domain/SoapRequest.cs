using System.ComponentModel.DataAnnotations;

namespace IngresserBackend.Domain
{
    public class SoapRequest
    {
        [Required]
        public required string Xml { get; set; }

        [Required]
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

    /// <summary>
    /// 0 - Embarque, 1 - NF-e
    /// </summary>
    public enum EntityType
    {
        Shipment,
        NFe
    }

    public class Configs
    {
        /// <summary>
        /// Ex.: 1058, 1059...
        /// </summary>
        [Required]
        public int Port { get; set; }

        /// <summary>
        /// Somente usado para chamadas de documentos
        /// </summary>
        public string? EnterpriseId { get; set; }

        /// <summary>
        /// Somente usado para chamadas de documentos
        /// </summary>
        public string? Token { get; set; }
    }
}
