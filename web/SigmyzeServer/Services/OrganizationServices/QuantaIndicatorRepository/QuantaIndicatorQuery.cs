using MongoDB.Bson;
using SigmyzeServer.Models.ApplicationServices;

namespace SigmyzeServer.Services.OrganizationServices;

public partial class QuantaIndicatorRepository
{
    private List<BsonDocument> buildPipeline(string quantaId, BsonDocument[] prevPipe)
    {
        List<BsonDocument> pipeline = new List<BsonDocument>();
        BsonDocument[] _chunkStage = chunkStage(quantaId);

        //append both to the pipeline
        for(int i = 0; i < _chunkStage.Length; i++)
            pipeline.Add(_chunkStage[i]);
        for(int i = 0; i < prevPipe.Length; i++)
            pipeline.Add(prevPipe[i]);

        return pipeline;
    }

    private BsonDocument[] chunkStage(string quantaId)
    {
        BsonDocument matchStage = new BsonDocument {
            {
                "$match", new BsonDocument{
                    { "project_id", quantaId }
                }
            }
        };

        BsonDocument groupStage = new BsonDocument {
            {
                "$group", new BsonDocument {
                    {
                        "_id", 0
                    },
                    {
                        "project_indicators", new BsonDocument {
                            {
                                "$addToSet", "$chunk_indicators"
                            }
                        }
                    }
                }
            }
        };

        BsonDocument fieldStage = new BsonDocument {
            {
                "$addFields", new BsonDocument {
                    {
                        "project_indicators", new BsonDocument {
                            {
                                "$reduce", new BsonDocument {
                                    { "input", "$project_indicators" },
                                    { "initialValue", new BsonArray {} },
                                    {
                                        "in", new BsonDocument {
                                            {
                                                "$concatArrays", new BsonArray {
                                                    "$$value",
                                                    "$$this"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        BsonDocument[] output = new BsonDocument[] {
            matchStage,
            groupStage, 
            fieldStage
        };

        return output;
    }

    private BsonDocument matchQueryStage(List<QuantaQuery> query)
    {
        BsonArray andArray = new BsonArray {};
        for(int i = 0; i < query.Count; i++)
        {
            QuantaQuery obj = query[i];
            if(validateQuery(obj) == false)
                continue;
            if(obj.MultiValue == true)
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

        //handle the creation of or elements
        BsonArray orArray = new BsonArray {};
        for(int i = 0; i < query.Count; i++)
        {
            QuantaQuery obj = query[i];
            if(obj.MultiValue != true)
                continue;
            if(validateOptionalQuery(obj) == false)
                continue;

            switch(obj.FieldType!) {
                case "string":
                    //iterate thru the strings in the query
                    List<string> stringFields = obj.StringFields!;
                    for(int x = 0; x < stringFields.Count; x++)
                    {
                        string field = stringFields[x];
                        BsonDocument orObject = new BsonDocument {};
                        
                        orObject.Add(new BsonElement("fieldKey", obj.FieldKey!));
                        orObject.Add("stringField", field);
                        BsonDocument queryBson = new BsonDocument {
                            {
                                "project_indicators.field.datasetFields", new BsonDocument {
                                    {
                                        "$elemMatch", orObject
                                    }
                                }
                            }
                        };

                        orArray.Add(queryBson);
                    }

                    break;
                case "date":
                    List<int> dateFields = obj.DateFields!;
                    for(int x = 0; x < dateFields.Count; x++)
                    {
                        int field = dateFields[x];
                        BsonDocument orObject = new BsonDocument {};
                        
                        orObject.Add(new BsonElement("fieldKey", obj.FieldKey!));
                        orObject.Add("dateField", field);
                        BsonDocument queryBson = new BsonDocument {
                            {
                                "project_indicators.field.datasetFields", new BsonDocument {
                                    {
                                        "$elemMatch", orObject
                                    }
                                }
                            }
                        };
                    }

                    break;
            }
        }

        BsonDocument orCondition = new BsonDocument {
            {
                "$or", orArray
            }
        };

        BsonDocument finMatchObject = new BsonDocument {};
        if(orArray.Count > 0)
            andArray.Add(orCondition);
        if(andArray.Count > 0)
            finMatchObject.Add("$and", andArray);

        BsonDocument matchArrStage = new BsonDocument {
            {
                "$match", finMatchObject
            }
        };

        return matchArrStage;
    }
}