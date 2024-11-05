using IngresserBackend.Domain;
using IngresserBackend.Service;
using Microsoft.AspNetCore.Mvc;

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

                return Ok($"url: {soapRequest.Url}, com xml enviado com sucesso!");
            }
            catch (Exception e)
            {
                return Problem(e.Message, null, 512, "IngresserProcessingError");
            }
        }
    }
}
