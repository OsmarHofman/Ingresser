using IngresserBackend.Domain;
using IngresserBackend.Service;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace IngresserBackend.Controllers
{
    [ApiController]
    [Route("sendXml")]

    public class IngresserAPIController : ControllerBase
    {
        private readonly ISoapCallService _soapCallService;

        public IngresserAPIController()
        {
            _soapCallService = new SoapCallService();
        }

        [HttpPost(Name = "sendXml")]
        public ActionResult SendXml([FromBody] SoapRequest soapRequest)
        {
            try
            {
                if (soapRequest == null)
                    throw new BadHttpRequestException("Requisição não preenchida!");

                var callResult = soapRequest.EntityType == EntityType.Shipment
                    ? _soapCallService.CallShipmentWebService(soapRequest)
                    : _soapCallService.CallDocumentWebService(soapRequest);

                if (callResult.Status == TaskStatus.Faulted)
                {
                    var wsError = soapRequest.EntityType == EntityType.Shipment
                        ? "\nErro na chamada para o WS de Embarques\n\t "
                        : "\nErro na chamada para o WS de Documentos\n\t ";

                    return Problem(wsError + callResult.Exception?.Message, null, 512, "IngresserProcessingError");
                }

                var resultMessage = new ResultMessage("Xml enviado com sucesso!", successful: true);

                return Ok(JsonConvert.SerializeObject(resultMessage));
            }
            catch (Exception e)
            {
                var resultMessage = new ResultMessage($"Erro ao tentar enviar o Xml!: {e.Message}", successful: false);

                return Problem(resultMessage.Message, null, 512, "IngresserProcessingError");
            }
        }
    }
}
