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
                using var request = new HttpRequestMessage(HttpMethod.Post, soapRequest.GetUrl());

                request.Headers.Add("SOAPAction", "ReceiveTransmission");
                request.Content = content;

                using var response = await new HttpClient().SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

                response.EnsureSuccessStatusCode();

                await response.Content.ReadAsStringAsync();
            }
            catch (Exception e)
            {
                await Task.FromException(e);
            }
        }

        public async Task CallDocumentWebService(SoapRequest soapRequest)
        {
            try
            {
                using var content = new StringContent(soapRequest.Xml, Encoding.UTF8, "text/xml");
                using var request = new HttpRequestMessage(HttpMethod.Post, soapRequest.GetUrl());

                request.Content = content;

                using var response = await new HttpClient().SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

                response.EnsureSuccessStatusCode();

                await response.Content.ReadAsStringAsync();
            }
            catch (Exception e)
            {
                await Task.FromException(e);
            }
        }
    }
}
