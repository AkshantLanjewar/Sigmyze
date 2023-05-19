using MongoDB.Bson;
using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;

namespace SigmyzeServer.Services.OrganizationServices;

public partial class QuantaIndicatorRepository
{
    public async Task<GetIndicatorsQuery?> SelectProjectIndicator(string projectId, List<QuantaQuery> query)
    {
        BsonDocument unwindStage = new BsonDocument {
            {
                "$unwind", "$project_indicators"
            }
        };

        BsonDocument matchArrStage = matchQueryStage(query);
        BsonDocument groupStage = new BsonDocument {
            {
                "indicators", new BsonDocument {
                    {
                        "$push", "$project_indicators"
                    },
                    {
                        "_id", null
                    }
                }
            }
        };

        BsonDocument finProject = new BsonDocument {
            {
                "$project", new BsonDocument {
                    {
                        "indicators", "$indicators"
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
        List<GetIndicatorsQuery> results = await _quantaIndicatorChunks
            .Aggregate<GetIndicatorsQuery>(pipeline).ToListAsync();
            
        if(results.Count == 0)
            return null;

        return results[0];
    }

    public async Task<QuantaIndicator?> SelectProjectIndicatorId(string projectId, string indicatorId)
    {
        BsonDocument unwindStage = new BsonDocument {
            {
                "$unwind", "$project_indicators"
            }
        };

        BsonDocument indicatorMatchStage = new BsonDocument {
            {
                "$match", new BsonDocument {
                    {
                        "project_indicators.indicatorId", indicatorId
                    }
                }
            }
        };

        BsonDocument groupStage = new BsonDocument {
            {
                "indicators", new BsonDocument {
                    {
                        "$push", "$project_indicators"
                    },
                    {
                        "_id", null
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
                        "indicators", "$indicators"
                    }
                }
            }
        };

        BsonDocument[] rawPipeline = new BsonDocument[]
        {
            unwindStage,
            indicatorMatchStage,
            groupStage,
            finProject
        };

        List<BsonDocument> pipeline = buildPipeline(projectId, rawPipeline);
        List<GetIndicatorsQuery> results = await _quantaIndicatorChunks
            .Aggregate<GetIndicatorsQuery>(pipeline).ToListAsync();

        if(results.Count == 0)
            return null;

        List<QuantaIndicator>? indicators = results[0].Indicators;
        if(indicators == null || indicators.Count == 0)
            return null;

        return indicators[0];
    }

    public async Task<GetIndicatorsQuery?> PageSelectedIndicators(string projectId, List<QuantaQuery> query, int page, int pageLen)
    {
        BsonDocument unwindStage = new BsonDocument {
            {
                "$unwind", "$project_indicators"
            }
        };

        BsonDocument? matchArrStage = matchQueryStage(query);
        if(query.Count == 0)
            matchArrStage = null;

        BsonDocument groupStage = new BsonDocument {
            {
                "$group", new BsonDocument {
                    {
                        "indicators", new BsonDocument {
                            { "$push", "$project_indicators" },
                        }
                    },
                    {
                        "_id", 0
                    }
                }
            }
        };

        page = page * pageLen;
        BsonDocument finProject = new BsonDocument {
            {
                "$project", new BsonDocument {
                    {
                        "_id", 0
                    },
                    {
                        "indicators", new BsonDocument {
                            {
                                "$slice", new BsonArray {
                                    "$indicators",
                                    page,
                                    pageLen
                                }
                            }
                        }
                    }
                }
            }
        };

        List<BsonDocument> rawPipeline = new List<BsonDocument>();
        rawPipeline.Add(unwindStage);
        if(matchArrStage != null)
            rawPipeline.Add(matchArrStage);

        rawPipeline.Add(groupStage);
        rawPipeline.Add(finProject);

        List<BsonDocument> pipeline = buildPipeline(projectId, rawPipeline.ToArray());
        List<GetIndicatorsQuery> results = await _quantaIndicatorChunks
            .Aggregate<GetIndicatorsQuery>(pipeline).ToListAsync();
        if(results.Count == 0)
            return null;

        return results[0];
    }
}