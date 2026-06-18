## Introduction
This file contains the models for the publicly accessing of published quanta datasets. It has two members, [`QuantaDatasetDisplay`](#quantadatasetdisplay), and [`GetDatasetCardsResponse`](#getdatasetcardsresponse).

## `QuantaDatasetDisplay`
This is the object that defines the information that is publicly available for a quanta display for a card format. It contains basic info, such as name and id, etc...

### Definition
```cs
public class QuantaDatasetDisplay
{
    public string? DatasetName { get; set; }

    public string? DatasetId { get; set; }

    public string? Description { get; set; }
}
```

**Fields**
- `DatasetName` (this is the name for the returned dataset)
- `DatasetId` (this is the public ID that is used to query the dataset using the quanta endpoints)
- `Description` (this is the dataset description, provided by the user through the quanta editor UI)

### JSON Representation
```json
{
    "datasetName": string,
    "datasetId": string,
    "description": string
}
```

## `GetDatasetCardsResponse`
This is the response to the request to get all of the publicly published quanta datasets in card form, or any other request requesting the card data for a dataset.

### Definition
```cs
public class GetDatasetCardsResponse
{
    public APIStatusMsg? Status { get; set; }

    public List<QuantaDatasetDisplay>? DatasetCards { get; set; }
}
```

**Fields**
- `Status` (This is the [api status](./api-status.md) for the dataset card request)
- `DatasetCards` (these are the [cards](#quantadatasetdisplay) that were returned from the request)