using SigmyzeServer.Models.ApplicationServices;
using MongoDB.Driver;

namespace SigmyzeServer.Services.OrganizationServices;

public partial class QuantaIndicatorRepository
{
    public async Task UpdateChunk(string chunkId, string mode, List<QuantaIndicator> indicators)
    {
        QuantaIndicatorChunk? chunk = await _quantaIndicatorChunks.Find(x => x.ChunkId == chunkId)
            .FirstOrDefaultAsync();
        if(chunk == null)
            return;

        List<QuantaIndicator>? updatedIndicators = chunk.ProjectIndicators;
        if(updatedIndicators == null)
            return;

        for(int i = 0; i < indicators.Count; i++)
        {
            QuantaIndicator indicator = indicators[i];
            if(indicator.IndicatorId == null)
                continue;
            int chunkIndex = chunk.IndicatorIndex(indicator.IndicatorId);
            if(chunkIndex == -1)
                continue;

            QuantaIndicator currentIndicator = chunk.ProjectIndicators![chunkIndex];
            switch(mode) {
                case "append":
                    List<ChartData>? currentData = currentIndicator.ChartData;
                    if(currentData == null || indicator.ChartData == null)
                        continue;

                    List<int> collectedXValues = new List<int>();
                    for(int x = 0; x < currentData.Count; x++)
                    {
                        ChartData point = currentData[x];
                        int? xValue = point.XValue;
                        if(xValue == null)
                            continue;

                        collectedXValues.Add((int)xValue!);
                    }

                    for(int x = 0; x < indicator.ChartData.Count; x++)
                    {
                        ChartData point = indicator.ChartData[x];
                        if(x >= currentData.Count)
                            currentData.Add(point);
                        else
                        {
                            if(point.XValue == null)
                                continue;

                            int xValue = (int)point.XValue;
                            if(collectedXValues.Contains(xValue))
                                continue;
                            currentData.Add(point);
                        }
                    }

                    //sort the data based on the x value
                    currentData = currentData.OrderBy(x => x.XValue).ToList();
                    currentIndicator.ChartData = currentData;
                    break;
                case "replace":
                    currentIndicator.ChartData = indicator.ChartData;
                    break;
                default:
                    continue;
            }

            updatedIndicators[chunkIndex] = currentIndicator;
        }

        //update the indicator within the collection
        var filter = Builders<QuantaIndicatorChunk>
            .Filter.Eq(x => x.ChunkId, chunkId);

        var update = Builders<QuantaIndicatorChunk>
            .Update.Set(x => x.ProjectIndicators, updatedIndicators);

        await _quantaIndicatorChunks.UpdateOneAsync(filter, update);
    }

    public async Task ChunkIndicators(string quantaId, List<QuantaIndicator> indicators)
    {
        int breakPoint = 0;
        List<QuantaIndicatorChunk> newChunks = new List<QuantaIndicatorChunk>();
        List<QuantaIndicator> tmpChunk = new List<QuantaIndicator>();

        for(int i = 0; i < indicators.Count; i++)
        {
            QuantaIndicator indicator = indicators[i];
            if(breakPoint == 750)
            {
                QuantaIndicatorChunk nChunk = new QuantaIndicatorChunk();
                nChunk.QuantaId = quantaId;
                nChunk.ProjectIndicators = tmpChunk;

                breakPoint = 0;
                tmpChunk = new List<QuantaIndicator>();

                newChunks.Add(nChunk);
                continue;
            }

            tmpChunk.Add(indicator);
            breakPoint++;
        }

        //add the default tmp chunk
        if(tmpChunk.Count > 0)
        {
            QuantaIndicatorChunk nChunk = new QuantaIndicatorChunk();
            nChunk.QuantaId = quantaId;
            nChunk.ProjectIndicators = tmpChunk;

            newChunks.Add(nChunk);
        }

        QuantaIndicatorRepositoryDef? indicatorRoot = await _quantaRepository
            .Find(x => x.QuantaId == quantaId)
            .FirstOrDefaultAsync();

        Console.WriteLine(indicators.Count);
        List<string> collectedChunks = new List<string>();
        if(indicatorRoot?.IndicatorChunks != null)
            collectedChunks = indicatorRoot.IndicatorChunks;

        List<string> updatedChunks = new List<string>();
        for(int i = 0; i < newChunks.Count; i++)
        {
            QuantaIndicatorChunk chunk = newChunks[i];
            string chunkId = Guid.NewGuid().ToString();
            bool collected = false;

            if(i < collectedChunks.Count)
            {
                chunkId = collectedChunks[i];
                collected = true;
            }

            //now update or insert chunk
            if(collected == true)
            {
                //we want to update a prexisting chunk within the database
                var filter = Builders<QuantaIndicatorChunk>.Filter
                    .Eq(x => x.ChunkId, chunkId);
                var update = Builders<QuantaIndicatorChunk>.Update
                    .Set(x => x.ProjectIndicators, chunk.ProjectIndicators);

                await _quantaIndicatorChunks.UpdateOneAsync(filter, update);
                updatedChunks.Add(chunkId);
            } 
            else 
            {
                chunk.ChunkId = chunkId;
                await _quantaIndicatorChunks.InsertOneAsync(chunk);
                updatedChunks.Add(chunkId);
            }
        }

        //cleanup the chunks if we end up with less chunks than before
        for(int i = 0; i < collectedChunks.Count; i++)
        {
            string collectedChunk = collectedChunks[i];
            if(updatedChunks.Contains(collectedChunk) == false)
                await _quantaIndicatorChunks.DeleteOneAsync(x => x.ChunkId == collectedChunk);
        }

        //now we update the root object
        if(indicatorRoot == null)
        {
            indicatorRoot = new QuantaIndicatorRepositoryDef();
            indicatorRoot.QuantaId = quantaId;
            indicatorRoot.IndicatorChunks = updatedChunks;

            await _quantaRepository.InsertOneAsync(indicatorRoot);
        }
        else
        {
            var rootFilter = Builders<QuantaIndicatorRepositoryDef>.Filter
                .Eq(x => x.QuantaId, quantaId);
            var rootUpdate = Builders<QuantaIndicatorRepositoryDef>.Update
                .Set(x => x.IndicatorChunks, updatedChunks);

            await _quantaRepository.UpdateOneAsync(rootFilter, rootUpdate);
        }
    }
}