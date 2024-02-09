using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;

namespace SigmyzeServer.Services.DatasetShared;

public partial class DatasetShared
{
    public async Task<GetQuantaIndicatorsResp> GetSelectedIndicator(QuantaQueryBody body)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "fetched";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        if(body.QuantaId == null || body.Params == null)
        {
            status.Error = true;
            status.MSG = "bad_query";
            resp.Status = status;

            return resp;
        }

        GetIndicatorsQuery? queryRes = await _quantaIndicatorRepository.SelectProjectIndicator(body.QuantaId, body.Params);
        if(queryRes == null)
        {
            status.Error = true;
            status.MSG = "bad_db_query";
            resp.Status = status;

            return resp;
        }

        resp.Indicators = queryRes.Indicators;
        return resp;
    }

    public async Task<GetQuantaIndicatorsResp> PageSelectedIndicators(int pageLength, int page, QuantaQueryBody body)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "paged";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        if(body.QuantaId == null || body.Params == null)
        {
            status = ErrorMsg("bad_query");
            resp.Status = status;

            return resp;
        }

        GetIndicatorsQuery? query = await _quantaIndicatorRepository.PageSelectedIndicators(
            body.QuantaId, 
            body.Params, 
            page, 
            pageLength
        );

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

    public async Task<GetQuantaIndicatorResp> GetIndicatorById(string quantaId, string indicatorId)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "retreived";

        GetQuantaIndicatorResp resp = new GetQuantaIndicatorResp();
        QuantaIndicator? indicator = await _quantaIndicatorRepository.SelectProjectIndicatorId(quantaId, indicatorId);
        if(indicator == null)
        {
            status = ErrorMsg("bad_req");
            resp.Status = status;

            return resp;
        }

        resp.Indicator = indicator;
        resp.Status = status;
        return resp;
    }
}