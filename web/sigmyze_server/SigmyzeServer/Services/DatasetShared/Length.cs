using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;

namespace SigmyzeServer.Services.DatasetShared;

public partial class DatasetShared
{
    public async Task<GetQuantaIndicatorsLengthResp> GetSelectorIndicatorsLength(QuantaQueryBody body)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "fetched";

        GetQuantaIndicatorsLengthResp resp = new GetQuantaIndicatorsLengthResp();
        if(body.QuantaId == null || body.Params == null)
        {
            status = ErrorMsg("bad_query");
            resp.Status = status;

            return resp;
        }

        GetIndicatorsLength? query = await _quantaIndicatorRepository.SelectProjectIndicatorLength(
            body.QuantaId, 
            body.Params
        );

        if(query == null)
        {
            status = ErrorMsg("quanta_not_found");
            resp.Status = status;

            return resp;
        }

        resp.Status = status;
        resp.Length = query.IndicatorsLength;
        return resp;
    }

    public async Task<GetQuantaIndicatorsLengthResp> GetIndicatorsLength(string quantaId)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "length";

        GetQuantaIndicatorsLengthResp resp = new GetQuantaIndicatorsLengthResp();
        GetIndicatorsLength? indicatorLength = await _quantaIndicatorRepository.GetProjectIndicatorsLength(quantaId);
        if(indicatorLength == null)
        {
            status = ErrorMsg("quanta_not_found");
            resp.Status = status;

            return resp;
        }

        resp.Length = indicatorLength.IndicatorsLength;
        resp.Status = status;
        return resp;
    }
}