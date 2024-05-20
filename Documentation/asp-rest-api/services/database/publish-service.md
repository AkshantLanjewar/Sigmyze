## Introduction
This is the service that handles all operations related to publishing a quanta dataset within the platform.

## Definition
```cs
public interface IPublishService
{
    Task<PublishedDatasetCollection?> FetchPublishedDatasetQ(string quantaId);
    Task<PublishedDatasetCollection?> FetchPublishedDataset(string publicId);
    Task CreateOrganizationMapping(string organizationId);
    Task<bool> InOrganizationMapping(string organizationId, string datasetId);
    Task AppendOrganizationMapping(string organizationId, string datasetId);
    Task ReduceOrganizationMapping(string organizationId, string datasetId);
    Task<string> PublishDataset(PublishDatasetPOST data);
    Task<string> UnpublishDataset(UnpublishDatasetPOST data);
    Task<List<QuantaDatasetDisplay>?> GetDatasetCards(string organizationId);
}
```

## Methods
### FetchPublishedDatasetQ (async)
```cs
Task<PublishedDatasetCollection?> FetchPublishedDatasetQ(string quantaId);
```
This is the function that fetches a published quanta dataset by using its private quanta id.

**Parameters**
- `quantaId` (the quanta id for the published dataset)

**Returns**: This function returns a published dataset if found, `null` otherwise

### FetchPublishedDataset (async)
```cs
Task<PublishedDatasetCollection?> FetchPublishedDataset(string publicId);
```
This is the function that fetches a published dataset using its publicly accessible id.

**Parameters**
- `publicId` (this is the public id for the dataset)

**Returns**: This function returns a published dataset if found, `null` otherwise

### CreateOrganizationMapping (async)
```cs
Task CreateOrganizationMapping(string organizationId);
```
This is the function that creates a link between an organization, and all of the datasets that have been published within that organization.

**Parameters**
- `organizationId` (the id of the [organization](../../models/application-services/organization-data/organization.md) we are creating the list for)

### InOrganizationMapping (async)
```cs
Task<bool> InOrganizationMapping(string organizationId, string datasetId);
```
This is the function to see if a dataset is present within the published datasets of an organization.

**Parameters**
- `organizationId` (this is the id of the organization we are checking)
- `datasetId` (this is the public id we are checking to see is published within the organization)

**Returns**: This function returns a boolean value depending on whether or not the dataset is present within the organization

### AppendOrganizationMapping (async)
```cs
Task AppendOrganizationMapping(string organizationId, string datasetId);
```
This is the function that adds a published dataset id to the list of published datasets in an organization

**Parameters**
- `organizationId` (the id of the [organization](../../models/application-services/organization-data/organization.md) we adding a dataset too)
- `datasetId` (this is the id of the public dataset we have published)

### ReduceOrganizationMapping (async)
```cs
Task ReduceOrganizationMapping(string organizationId, string datasetId);
```
This is the function that removes a published dataset from the list of published datasets inside of an organization.

**Parameters**
- `organizationId` (the id of the [organization](../../models/application-services/organization-data/organization.md) we are removing a dataset from)
- `datasetId` (this is the id of the public dataset we have published)

### PublishDataset (async)
```cs
Task<string> PublishDataset(PublishDatasetPOST data);
```
This is the function that handles publishing a dataset, given the post data to publish the dataset.

**Parameters**
- `data` (this is the [post data](../../models/data/dataset-post.md#publishdatasetpost) to publish a dataset)

**Returns**: This function returns the possibel messages when it comes to publishing a dataset, which are:
- `success` (the dataset was published successfully)
- `invalid_token` (since we only want us to be able to publish atp, we need to make sure there is a secret token to block it off for now)
- `no_token` (the user is trying to publish a public database without a token)
- `dataset` (this dataset has already been published)
- `verify` (this service was requested with an invalid post body)

### UnpublishDataset (async)
```cs
Task<string> UnpublishDataset(UnpublishDatasetPOST data);
```
This is the function that handles unpublishing a dataset from the platform.

**Parameters**
- `data` (this is the [post data](../../models/data/dataset-post.md#unpublishdatasetpost) to unpublish a dataset)

**Returns**: This function returns the possible messages when it comes to unpublishing a dataset, which include:
- `success` (the dataset has been unpublished successfully)
- `no_document` (there is no document to mark the publishing of this dataset)
- `verify` (the function was called with an invalid post body)
