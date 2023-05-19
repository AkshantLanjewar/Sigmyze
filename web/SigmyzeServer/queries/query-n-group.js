use('SigmyzeOrganizations');

db.quanta_chunks.aggregate([
    {
        "$match": {
            "project_id": "9795aea6-4fe3-409a-9df3-a5bdf0cd6988"
        }
    },
    {
        "$group": {
            "_id": null,
            "project_indicators": { "$addToSet": "$chunk_indicators" }
        }
    },
    {
        "$addFields": {
            "project_indicators": {
                "$reduce": {
                    "input": "$project_indicators",
                    "initialValue": [],
                    "in": {
                        "$concatArrays": ["$$value", "$$this"]
                    }
                }
            }
        }
    },
    {
        "$unwind": "$project_indicators"
    },
    {
        "$match": {
            "$and": [
                {
                    "$or": [
                        {
                            "project_indicators.field.datasetFields": {
                                "$elemMatch": {
                                    "fieldKey": "name",
                                    "stringField": "Gross domestic product, deflator" //
                                }
                            }
                        },
                        {
                            "project_indicators.field.datasetFields": {
                                "$elemMatch": {
                                    "fieldKey": "name",
                                    "stringField": "General government primary net lending/borrowing" //
                                }
                            }
                        }
                    ]
                }
            ]
        }
    },
])