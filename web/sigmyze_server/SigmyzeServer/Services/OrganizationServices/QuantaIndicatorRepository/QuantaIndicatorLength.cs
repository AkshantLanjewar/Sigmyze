using MongoDB.Bson;
using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;

namespace SigmyzeServer.Services.OrganizationServices;

public partial class QuantaIndicatorRepository
{
    public async Task<GetIndicatorsLength?> SelectProjectIndicatorLength(string projectId, List<QuantaQuery> query)
    {
        BsonDocument unwindStage = new BsonDocument {
            {
                "$unwind", "$project_indicators"
            }
        };

        BsonDocument matchArrStage = matchQueryStage(query);
        BsonDocument groupStage = new BsonDocument {
            {
                "$group", new BsonDocument {
                    {
                        "_id", 0
                    },
                    {
                        "indicators", new BsonDocument {
                            {
                                "$push", "$project_indicators"
                            }
                        }
                    }
                }
            }
        };

        BsonDocument finProject = new BsonDocument {
            {
                "$project", new BsonDocument {
                    {
                        "_id", 0
                    },
                    {
                        "indicators_length", new BsonDocument {
                            {
                                "$size", "$indicators"
                            }
                        }
                    }
                }
            }
        };

        BsonDocument[] rawPipeline = new BsonDocument[]
        {
            unwindStage,
            matchArrStage,
            groupStage,
            finProject
        };

        List<BsonDocument> pipeline = buildPipeline(projectId, rawPipeline);
        List<GetIndicatorsLength> results = await _quantaIndicatorChunks
            .Aggregate<GetIndicatorsLength>(pipeline).ToListAsync();
            
        if(results.Count == 0) 
            return null;

        return results[0];
    }

    public async Task<GetIndicatorsLength?> GetProjectIndicatorsLength(string quantaId)
    {
        BsonDocument projectStage = new BsonDocument {
            {
                "$project", new BsonDocument {
                    {
                        "_id", 0
                    },
                    {
                        "indicators_length", new BsonDocument {
                            {
                                "$size", "$project_indicators"
                            }
                        }
                    }
                }
            }
        };

        BsonDocument[] rawPipeline = new BsonDocument[]
        {
            projectStage
        };

        List<BsonDocument> pipeline = buildPipeline(quantaId, rawPipeline);
        List<GetIndicatorsLength> results = await _quantaIndicatorChunks
            .Aggregate<GetIndicatorsLength>(pipeline).ToListAsync();

        if(results.Count == 0)
            return null;

        return results[0];
    }
}