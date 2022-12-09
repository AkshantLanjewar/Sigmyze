# IDriveService
The drive service is how the application interacts with the drive collection.
Currently its functionality only extends to getting drives and saving them.

## Implementation
```cs
public interface IDriveService
{
    Task<Drive> GetDrive(string lunarId);

    Task SaveDrive(string lunarId, Drive nDrive);
}
```

## Methods

### GetDrive(string lunarId)
`Task<Drive>`
> This method retrieves the [drive](../Models/UserData/drive.md) from the database.
> If no such [drive](../Models/UserData/drive.md) exists, it creates one. <br />
> Note: LunarID can also refer to OrganizationId if this 
> [drive](../Models/UserData/drive.md) is for an [organization](../Models/Organization/organization-model.md).

### SaveDrive(string lunarId, Drive nDrive)
`Task`
> This method updates the [drive](../Models/UserData/drive.md) with the new [drive](../Models/UserData/drive.md) data. <br />
> Note: LunarID can also refer to OrganizationId if this 
> [drive](../Models/UserData/drive.md) is for an [organization](../Models/Organization/organization-model.md).
