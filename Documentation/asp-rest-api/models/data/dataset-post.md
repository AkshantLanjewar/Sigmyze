## Introduction
This file contains the two POST requests related to publishing and unpublishing a dataset from the publicly published list of datasets.

## PublishDatasetPOST
This is the body of the POST request that handles the publishing of a dataset to the publicly available list of datasets.

### Definition
```cs
public class PublishDatasetPOST
{
    public string? Title { get; set; }
    public string? DatasetId { get; set; }
    public string? Description { get; set; }
    public bool? Public { get; set; }
    public string? QuantaId { get; set; }
    public string? OrganizationId { get; set; }
    public string? PublicToken { get; set; }
}
```

**Fields**
- `Title` (This is the public title for the dataset)
- `DatasetId` (this is the publicly assigned dataset id for this dataset)
- `Description` (This is the description for a published dataset)
- `Public` (whether or not this dataset will be published publicly or to the internal organization only)
- `QuantaId` (this is the project id for the quanta project that is publishing a dataset)
- `OrganizationId` (the organization the quanta project belongs too)
- `PublicToken` (this is the password used to publish public datasets)

**Methods**
```cs
public bool Verify()
```
This is the function to check whether or not the body of this post is indeed a valid body.

## UnpublishDatasetPOST
This is the body of the POST request that handles the unpublishing of a quanta dataset.

### Definition
```cs
public class UnpublishDatasetPOST
{
    public string? OrganizationId { get; set; }
    public string? QuantaId { get; set; }
}
```

**Fields**
- `OrganizationId` (the id of the organization the project is in)
- `QuantaId` (the id of the project that is being unpublished)

**Methods**
```cs
public bool Verify()
```
This is the function to check whether or not this is a valid POST body for the request.