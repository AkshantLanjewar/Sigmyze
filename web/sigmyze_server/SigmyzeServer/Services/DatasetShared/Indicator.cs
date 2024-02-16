using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;

namespace SigmyzeServer.Services.DatasetShared;

public partial class DatasetShared
{
    public async Task<GetQuantaIndicatorsResp> GetIndicators(string quantaId)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "retreive";

        GetQuantaIndicatorsResp response = new GetQuantaIndicatorsResp();
        response.Status = msg;
        GetIndicatorsQuery? indicatorsRes = await _quantaIndicatorRepository.PageSelectedIndicators(
            quantaId, 
            new List<QuantaQuery>(), 
            0, 
            20
        );

        List<QuantaIndicator>? indicators = indicatorsRes?.Indicators;
        if (indicators == null)
        {
            msg = ErrorMsg("invalid_quanta");
            response.Status = msg;

            return response;
        }

        response.Indicators = indicators;
        return response;
    }

    public async Task<GetQuantaIndicatorsResp> GetIndicatorPage(string quantaId, int pageLength, int page)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "paged";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        GetIndicatorsQuery? query = await _quantaRepository.GetProjectIndicators(quantaId, page, pageLength);
        if(query == null)
        {
            status = ErrorMsg("invalid_quanta");
            resp.Status = status;

            return resp;
        }

        resp.Status = status;
        resp.Indicators = query.Indicators;
        return resp;
    }
}