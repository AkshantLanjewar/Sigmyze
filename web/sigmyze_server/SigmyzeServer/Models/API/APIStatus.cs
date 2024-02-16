using Newtonsoft.Json;

namespace SigmyzeServer.Models.API
{
    public class APIStatusMsg
    {
        [JsonProperty("error")]
        public bool Error { get; set; }

        [JsonProperty("msg")]
        public string MSG { get; set; }

        public static APIStatusMsg SuccessMSG(string msg)
        {
            APIStatusMsg status = new APIStatusMsg
            {
                Error = false,
                MSG = msg
            };

            return status;
        }

        public static APIStatusMsg ErrorMSG(string msg)
        {
            APIStatusMsg status = new APIStatusMsg
            {
                Error = true,
                MSG = msg
            };

            return status;
        }
    }

}