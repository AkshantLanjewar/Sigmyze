using SigmyzeServer.Models.ApplicationServices;
using MongoDB.Driver;

namespace SigmyzeServer.Services.OrganizationServices;

public partial class QuantaIndicatorRepository
{
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

        QuantaIndicatorRepositoryDef? indicatorRoot = await _quantaRepository
            .Find(x => x.QuantaId == quantaId)
            .FirstOrDefaultAsync();

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