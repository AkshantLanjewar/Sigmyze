## Introduction
This file contains all of the documentation for the Drive Repository service 

## Definition
```cs
public interface IDriveRepository
{
    Task<List<Drive>> GetAllAsync();
    Task<Drive?> GetDrive(string driveId);
    Task UpdateDrive(string driveId, Drive nOrganization);
    Task InsertDrive(Drive nDrive);
    Task DeleteDrive(string driveId);
}
```

## Methods
### GetAllAsync (async)
```cs
Task<List<Drive>> GetAllAsync();
```
This is the function that returns all of the drives that are stored on the database.

**Returns**: This function returns a list of [drives](../models/application-services/organization-data/drive.md#drive) that were stored on the mongodb collection

### GetDrive (async)
```cs
Task<Drive?> GetDrive(string driveId);
```
This is the function that returns a specific drive by querying by drive id

**Parameters**
- `driveId` (this is the id of the drive we want from the collection)

**Returns**: This function returns the [drive](../models/application-services/organization-data/drive.md#drive) if found, `null` otherwise

### UpdateDrive (async)
```cs
Task UpdateDrive(string driveId, Drive nOrganization);
```
This is the function that handles updating a drive on the mongodb collection

**Parameters**
- `driveId` (this is the id of the drive we are updating on the collection)
- `nOrganization` (this is the new [drive](../models/application-services/organization-data/drive.md#drive) that is to be stored)

### DeleteDrive
```cs
Task DeleteDrive(string driveId);
```
This is the function that handles deleting a drive from the collection.

**Parameters**
- `driveId` (this is the id of the drive we are deleting from the collection)