using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;

namespace SigmyzeServer.Controllers;

public partial class QuantaController 
{
    [HttpPost("update_indicators")]
    [MapToApiVersion("2.0")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateIndicators([FromBody]UpdateQuantaIndicatorBody body)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "updated";

        if(body.Validate() == false)
        {
            status = ErrorMsg("bad_body");
            return await SerializeJSON(status);
        }

        List<string> indicatorsCached = body.Indicators!;
        Dictionary<string, List<QuantaIndicator>> updateMap = new Dictionary<string, List<QuantaIndicator>>();

        for(int i = 0; i < indicatorsCached.Count; i++)
        {
            string cache = indicatorsCached[i];
            QuantaIndicator? indicator = JsonConvert.DeserializeObject<QuantaIndicator>(cache);
            if(indicator == null || indicator.ChartData == null || indicator.Field == null)
                continue;

            List<QuantaQuery>? query = indicator.Field.ToQuery();
            if(query == null)
                continue;

            string? idSplit = await _quantaIndicatorRepository.SelectorProjectIndicatorChunkId(body.QuantaId!, query);
            if(idSplit == null)
                continue;

            List<string> split = idSplit.Split("::").ToList();
            if(split.Count != 2)
                continue;

            string chunkId = split[0];
            indicator.IndicatorId = split[1];
            if(updateMap.ContainsKey(chunkId))
            {
                List<QuantaIndicator> prevValues = updateMap[chunkId];
                prevValues.Add(indicator);
                updateMap[chunkId] = prevValues;
            }
            else
            {
                List<QuantaIndicator> nValues = new List<QuantaIndicator>();
                nValues.Add(indicator);
                updateMap.Add(chunkId, nValues);
            }
        }

        //now we go through the chunks, and update them
        List<string> keys = new List<string>(updateMap.Keys);
        for(int i = 0; i < keys.Count; i++)
        {
            string chunkId = keys[i];
            List<QuantaIndicator> indicators = updateMap[chunkId];

            await _quantaIndicatorRepository.UpdateChunk(chunkId, body.Mode!, indicators);
        }

        return await SerializeJSON(status);
    }

    [HttpPost("add_indicator")]
    [MapToApiVersion("2.0")]
    [AllowAnonymous]
    public async Task<IActionResult> AddIndicator([FromBody]AddQuantaIndicator body)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "added indicators";

        if(body.ProcessId == null || body.OrganizationId == null || body.QuantaId == null || body.Indicators == null)
        {
            status.Error = true;
            status.MSG = "missing_params";
            return await SerializeJSON(status);
        }

        QuantaProjectCacheId? cache = await _quantaRepository.GetQuantaProjectCache(body.QuantaId, body.ProcessId);
        if(cache == null || cache.OrganizationId != body.OrganizationId)
        {
            status.Error = true;
            status.MSG = "invalid_cache";
            return await SerializeJSON(status);
        }

        List<QuantaIndicator> newIndicators = new List<QuantaIndicator>();
        List<string> indicators = body.Indicators;
        for(int i = 0; i < indicators.Count; i++)
        {
            string raw_indicator = indicators[i];
            QuantaIndicator? indicator = JsonConvert.DeserializeObject<QuantaIndicator>(raw_indicator);
            if(indicator == null || indicator.ChartData == null || indicator.Field == null)
                continue;

            newIndicators.Add(indicator);
        }

        //retreive and update the quanta project
        await _quantaIndicatorRepository.ClearIndicators(body.QuantaId);
        await _quantaIndicatorRepository.ChunkIndicators(body.QuantaId, newIndicators);
        return await SerializeJSON(status);
    }

    [HttpPost("{organizationId}/{projectId}")]
    public async Task<IActionResult> UpdateProject(
        string organizationId, 
        string projectId,
        [FromBody]UpdateQuantaDataBody body 
    )
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "updated";

        if(body.Data == null)
        {
            msg.Error = true;
            msg.MSG = "bad_param";
            return await SerializeJSON(msg);
        }

        await _quantaRepository.UpdateProjectData(projectId, body.Data);
        return await SerializeJSON(msg);
    }
}