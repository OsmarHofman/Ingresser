using IngresserBackend.Domain;
using IngresserBackend.Service;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace IngresserBackend.Controllers
{
    [ApiController]
    [Route("api")]
    public class IngresserAPIController : ControllerBase
    {
        private readonly ISoapCallService _soapCallService;

        public IngresserAPIController()
        {
            _soapCallService = new SoapCallService();
        }

        /// <summary>
        /// Faz o envio de um xml ao frete, considerando as configurações do ambiente
        /// </summary>
        /// <param name="soapRequest">Requisição contendo o xml, o tipo do xml e as configurações do ambiente</param>
        /// <returns>Se conseguiu ou não enviar o xml</returns>
        /// <exception cref="BadHttpRequestException"></exception>
        /// <remarks>
        /// Requisição de exemplo:
        ///
        ///     POST /sendXml
        ///     {
        ///        "xml": "<xmlDoEmbarque></xmlDoEmbarque>",
        ///        "entityType": 0,
        ///        "configs": {
        ///           "port": 1058,
        ///           "enterpriseId": "dfd558ac-2424-4983-aa0a-326deb5b72c6",
        ///           "token": "3f87a287-bcef-4fa0-83b7-792d6676c20c"
        ///        }
        ///     }
        ///
        /// </remarks>
        /// <response code="512">Algum erro no meio do processamento da API</response>
        [HttpPost, Route("sendXml")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(512)]
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
