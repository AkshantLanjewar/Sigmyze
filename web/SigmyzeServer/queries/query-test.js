/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('SigmyzeOrganizations');

db.quanta_indicators.aggregate([
    {
        "$match": {
            "project_id": "9795aea6-4fe3-409a-9df3-a5bdf0cd6988"
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
    {
        "$group": {
            "_id": 0,
            "indicators": {
                "$push": "$project_indicators"
            }
        }
    },
    {
        "$project": {
            "indicators_length": {
                "$size": "$indicators"
            }
        }
    }
])