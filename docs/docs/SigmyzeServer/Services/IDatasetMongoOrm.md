# IDatasetMongoOrm
The dataset service is how the application interfaces with the data collection in mongodb.
This is one of the most important services as it handles retrieving empirical data, aka the entire website functionality.

## Implementation
```cs
public interface IDatasetMongoOrm
{
    List<Dataset> GetDatasets();

    Task<List<string>?> ProcessedObjects(string dataset);
    
    Task<DatasetIndicator> GetIndicator(string dataset, string object_id, string indicator_id);

    Task<DatasetCollection> GetObject(string dataset, string object_id);

    Task<List<string>> Categories(string dataset);

    Task<List<DatasetObject>> ProcessedObjectsDetailed(string dataset);
}
```

## Methods

### GetDatasets()
`List<Dataset>`
> This returns a list of [Dataset](../Models/Data/Dataset.md) objects

### ProcessedObjects(string dataset) (Get Objects)
`Task<List<string>?>`
> Returns a list of the [objects](../Models/Data/Object.md) within the dataset

### ProcessedObjectsDetailed(string dataset)
`Task<List<DatasetObject>>`
> Returns a more detailed list of [objects](../Models/Data/Object.md) within the database

### GetIndicator(string dataset, string object_id, string indicator_id)
`Task<DatasetIndicator>`
> Retreive an [indicator](../Models/Data/Indicator.md) from an object inside a dataset, based on the indicator_id

### GetObject(string dataset, string object_id)
`Task<DatasetCollection>`
> This retreives an [object](../Models/Data/Object.md) from a dataset based on the object_id

### Categories(string dataset)
`Task<List<string>>`
> This returns a list of categories in a given [dataset](../Models/Data/Dataset.md)