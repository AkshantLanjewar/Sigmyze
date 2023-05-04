using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;
using SigmyzeServer.Models.User;

namespace SigmyzeServer.Services.OrganizationServices;

public interface IQuantaIndicatorRepository
{
    Task<GetIndicatorsQuery?> SelectProjectIndicator(string projectId, List<QuantaQuery> query);
    Task<GetIndicatorsLength?> GetProjectIndicatorsLength(string quantaId);
    Task<GetIndicatorsLength?> SelectProjectIndicatorLength(string projectId, List<QuantaQuery> query);
    Task<GetIndicatorsQuery?> PageSelectedIndicators(string projectId, List<QuantaQuery> query, int page, int pageLen);
    Task<QuantaIndicator?> SelectProjectIndicatorId(string projectId, string indicatorId);
}

public class QuantaIndicatorRepository : IQuantaIndicatorRepository
{
    private readonly IMongoCollection<QuantaRepositoryDefinition> _quantaRepository;
    public QuantaIndicatorRepository(IOptions<AuthDatabaseSettings> authDatabaseSettings)
    {
        var mongoClient = new MongoClient(authDatabaseSettings.Value.ConnectionString);
        var mongoDatabse = mongoClient.GetDatabase("SigmyzeOrganizations");

        _quantaRepository = mongoDatabse.GetCollection<QuantaRepositoryDefinition>("quanta_projects");

        //build the index's
        var quantaIdIndex = Builders<QuantaRepositoryDefinition>.IndexKeys.Ascending(x => x.ProjectId);
        _quantaRepository.Indexes.CreateOne(new CreateIndexModel<QuantaRepositoryDefinition>(quantaIdIndex));
    }

    private bool validateQuery(QuantaQuery query)
    {
        if(query.FieldKey == null || query.FieldType == null)
            return false;

        string fieldType = query.FieldType;
        if(fieldType == "string" && query.StringField == null)
            return false;
        if(fieldType == "date" && query.DateField == null)
            return false;

        return true;
    }

    private BsonDocument matchQueryStage(List<QuantaQuery> query)
    {
        BsonArray andArray = new BsonArray {};
        for(int i = 0; i < query.Count; i++)
        {
            QuantaQuery obj = query[i];
            if(validateQuery(obj) == false)
                continue;

            string fieldType = obj.FieldType!;
            BsonDocument matchObject = new BsonDocument{};
            matchObject.Add(new BsonElement("fieldKey", obj.FieldKey!));

            if(fieldType == "string")
                matchObject.Add("stringField", obj.StringField!);
            else
                matchObject.Add("dateField", obj.DateField!);

            BsonDocument queryBson = new BsonDocument {
                {
                    "project_indicators.field.datasetFields", new BsonDocument {
                        {
                            "$elemMatch", matchObject
                        }
                    }
                }
            };

            andArray.Add(queryBson);
        }

        BsonDocument matchArrStage = new BsonDocument {
            {
                "$match", new BsonDocument {
                    {
                        "$and", andArray
                    }
                }
            }
        };

        return matchArrStage;
    }

    public async Task<GetIndicatorsLength?> SelectProjectIndicatorLength(string projectId, List<QuantaQuery> query)
    {
        BsonDocument matchStage = new BsonDocument {
            {
                "$match", new BsonDocument {
                    { "project_id", projectId }
                }
            }
        };

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

        BsonDocument[] pipeline = new BsonDocument[]
        {
            matchStage,
            unwindStage,
            matchArrStage,
            groupStage,
            finProject
        };

        List<GetIndicatorsLength> results = await _quantaRepository.Aggregate<GetIndicatorsLength>(pipeline).ToListAsync();
        if(results.Count == 0)
            return null;

        return results[0];
    }

    public async Task<GetIndicatorsQuery?> SelectProjectIndicator(string projectId, List<QuantaQuery> query)
    {
        BsonDocument matchStage = new BsonDocument {
            {
                "$match", new BsonDocument {
                    { "project_id", projectId }
                }
            }
        };

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
                        "_id", 0
                    },
                    {
                        "indicators", "$indicators"
                    }
                }
            }
        };

        BsonDocument[] pipeline = new BsonDocument[]
        {
            matchStage,
            unwindStage,
            matchArrStage,
            groupStage,
            finProject
        };

        List<GetIndicatorsQuery> results = await _quantaRepository.Aggregate<GetIndicatorsQuery>(pipeline).ToListAsync();
        if(results.Count == 0)
            return null;

        return results[0];
    }

    public async Task<QuantaIndicator?> SelectProjectIndicatorId(string projectId, string indicatorId)
    {
        BsonDocument matchStage = new BsonDocument {
            {
                "$match", new BsonDocument {
                    { "project_id", projectId }
                }
            }
        };

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

        BsonDocument[] pipeline = new BsonDocument[]
        {
            matchStage,
            unwindStage,
            indicatorMatchStage,
            groupStage,
            finProject
        };

        List<GetIndicatorsQuery> results = await _quantaRepository.Aggregate<GetIndicatorsQuery>(pipeline).ToListAsync();
        if(results.Count == 0)
            return null;

        List<QuantaIndicator>? indicators = results[0].Indicators;
        if(indicators == null || indicators.Count == 0)
            return null;

        return indicators[0];
    }

    public async Task<GetIndicatorsQuery?> PageSelectedIndicators(string projectId, List<QuantaQuery> query, int page, int pageLen)
    {
        BsonDocument matchStage = new BsonDocument {
            {
                "$match", new BsonDocument {
                    { "project_id", projectId }
                }
            }
        };

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

        BsonDocument[] pipeline = new BsonDocument[]
        {
            matchStage,
            unwindStage,
            matchArrStage,
            groupStage,
            finProject
        };

        List<GetIndicatorsQuery> results = await _quantaRepository.Aggregate<GetIndicatorsQuery>(pipeline).ToListAsync();
        if(results.Count == 0)
            return null;

        return results[0];
    }

    public async Task<GetIndicatorsLength?> GetProjectIndicatorsLength(string quantaId)
    {
        BsonDocument matchStage = new BsonDocument{
            {
                "$match", new BsonDocument{
                    { "project_id", quantaId }
                }
            }
        };

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

        BsonDocument[] pipeline = new BsonDocument[]
        {
            matchStage,
            projectStage
        };

        List<GetIndicatorsLength> results = await _quantaRepository.Aggregate<GetIndicatorsLength>(pipeline).ToListAsync();
        if(results.Count == 0)
            return null;

        return results[0];
    }

}