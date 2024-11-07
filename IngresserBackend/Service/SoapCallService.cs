using IngresserBackend.Domain;
using System.Text;

namespace IngresserBackend.Service
{
    public class SoapCallService : ISoapCallService
    {

        public async Task CallShipmentWebService(SoapRequest soapRequest)
        {
            try
            {
                using var content = new StringContent(soapRequest.Xml, Encoding.UTF8, "text/xml");
                using var request = new HttpRequestMessage(HttpMethod.Post, soapRequest.Url);

                request.Headers.Add("SOAPAction", "ReceiveTransmission");
                request.Content = content;

                using var response = await new HttpClient().SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

                response.EnsureSuccessStatusCode();

                await response.Content.ReadAsStringAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task CallDocumentWebService(SoapRequest soapRequest)
        {
            try
            {
                var urlSend = $"{soapRequest.Url}?op=Send";

                using var content = new StringContent(soapRequest.Xml, Encoding.UTF8, "text/xml");
                using var request = new HttpRequestMessage(HttpMethod.Post, urlSend);

                request.Content = content;

                using var response = await new HttpClient().SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

                response.EnsureSuccessStatusCode();

                await response.Content.ReadAsStringAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
