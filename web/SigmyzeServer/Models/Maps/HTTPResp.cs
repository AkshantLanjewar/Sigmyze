using SigmyzeServer.Models.API;

namespace SigmyzeServer.Models.Maps
{
    public class GetMapIndicatorResp
    {
        public APIStatusMsg status { get; set; }
        public List<EconomicData> data { get; set; }
    }
}