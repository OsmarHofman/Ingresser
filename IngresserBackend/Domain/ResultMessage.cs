namespace IngresserBackend.Domain
{
    public class ResultMessage
    {
        public ResultMessage(string message, bool successful)
        {
            Message = message;
            Successful = successful;
        }

        public string Message { get; set; }

        public bool Successful { get ; set; }
    }
}
