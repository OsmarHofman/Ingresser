using IngresserBackend.Domain;
using IngresserBackend.Service;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace IngresserBackend.Controllers
{
    [ApiController]
    [Route("sendXml")]

    public class SoapMessageController : ControllerBase
    {
        private readonly ISoapCallService _soapCallService;

        public SoapMessageController()
        {
            _soapCallService = new SoapCallService();
        }

        [HttpPost(Name = "sendXml")]
        public ActionResult SendXml([FromBody] SoapRequest soapRequest)
        {
            try
            {
                _soapCallService.CallShipmentWebService(soapRequest);

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
