## Introduction + API Root
This document contains all of the API endpoints within the lunar controller, which handles all operations related to the lunar refresh platform on the website. 

**URL Base**: `/api/v1/refresh/lunar` \
**Allows Anonymous Access**: `false` \
**Consumed Services**:
- `IUserServiceRepository`: detailed docs can be found [here](../services/user-service-repository.md)
- `ILunarRefreshService`: detailed docs can be found [here](../services/lunar-refresh-service.md)

## Create Project
This is the API endpoint that handles hte creation of a new lunar refresh project

**URL**: `/create` \
**Allows Anonymous Access**: `false` \
**Method**: `POST`

### POST Body
The body of for the POST request is the JSON-ified version of the create lunar project body data structure
```json
{
    "lunarId": "{user_id}",
    "organizationId": "{org_id}",
    "projectId": "...",
    "name": "{project_name}"
}
```

### Successful Response
A successful API response is as follows
```json
{
    "status": {
        "error": false,
        "msg": "success"
    },
    "newId": "{project_id}"
}
```

### Error Response
When an error occurs, the status field changes to the following
```json
{
    "error": true,
    "msg": "..."
}
```

Where the `msg` can take the following values:
- `bad_body` (the post body sent was invalid)
- `bad_organization` (the organization that the project is to be created in is invalid)

### Sample Call
```bash
curl /api/v1/refresh/lunar/create
```

## Delete Project
This is the API endpoint that handles the deletion of a refresh project on the database

**URL**: `/delete` \
**Allows Anonymous Access**: `false` \
**Method**: `POST`

### POST Body
```json
{
    "lunarId": "{user_id}",
    "organizationId": "{organization_id}",
    "projectId": "{project_id}"
}
```

### Successful Response
```json
{
    "error": false,
    "msg": "success"
}
```

### Error Response
When an error occurs, the response changes as follows
```json
{
    "error": true,
    "msg": "..."
}
```

Where the `msg` can take the following values:
- `bad_body` (the body for the request is invalid)
- `bad_organization` (the user is not present within the organization the project is a part of)

### Sample Call
```bash
curl /api/v1/refresh/lunar/delete
```

## Fetch Lunar Project Data
This is the endpoint that handles fetching the editor data for a lunar refresh project.

**URL**: `/{lunarId}/{organizationId}/{projectId}`, where the fields correlate too: \
- `lunarId` (the id of the user who is accessing the project) 
- `organizationId` (the id of the organization the project belongs too)
- `projectId` (the id of the project that is being accessed)

**Allows Anonymous Access**: `false` \
**Method**: `GET`

### Successful Response
```json
{
    "status": {
        "error": false,
        "msg": "success"
    },
    "projectData": LunarProjectData
}
```
Where the project data follows the schema of the LunarProjectData object.

### Error Response
When an error occurs, the status changes as follows
```json
{
    "error": true,
    "msg": "..."
}
```

Where the `msg` can take the following values:
- `bad_organization` (the project does not exist within this organization or the organization doesnt exist)
- `bad_project_id` (the project id does not exist within the organization)

## Update Lunar File Tree
This is the endpoint that handles updating the file tree within a lunar refresh project.

**URL**: `/update/file-tree` \
**Allows Anonymous Access**: `false` \
**Method**: `POST`

### POST Body
```json
{
    "newFiletree": SimpleFilesystem,
    "lunarId": "{user_id}",
    "organizationId": "{organization_id}",
    "projectId": "{project_id}"
}
```
Where the filetree is the [simple filesystem object](../models/lunar/filesystem.md#simplefilesystem)

### Successful Response
```json
{
    "error": false,
    "msg": "success"
}
```

### Error Response
```json
{
    "error": true,
    "msg": "..."
}
```

Where the `msg` can take the following values:
- `bad_organization` (the project does not exist within this organization or the organization doesnt exist)
- `bad_body` (the body sent to the POST request was invalid)

## Update Lunar Chart
This is the API endpoint that handles updating the lunar charts within a refresh project

**URL**: `/update/chart` \
**Allows Anonymous Access**: `false` \
**Method**: `POST`

### POST Body
```json
{
    "lunarId": "{user_id}",
    "organizationId": "{organization_id}",
    "projectId": "{project_id}",
    "newCharts": LunarChart[]
}
```

Where the `newCharts` field is a list of the [lunar chart](../models/lunar/lunar-chart.md#lunarchart) object

### Successful Response
```json
{
    "error": false,
    "msg": "success"
}
```

### Error Response
```json
{
    "error": true,
    "msg": "..."
}
```

Where the `msg` can take the following values:
- `bad_organization` (the project does not exist within this organization or the organization doesnt exist)
- `bad_body` (the body sent to the POST request was invalid)

## Update Notes
This is the API endpoint that handles updating notes within a lunar refresh project

**URL**: `/update/notes` \
**Allows Anonymous Access**: `false` \
**Method**: `POST`

### POST Body
```json
{
    "lunarId": "{user_id}",
    "organizationId": "{organization_id}",
    "projectId": "{project_id}",
    "newNotes": LunarNote[]
}
```

Where the `newNotes` field is a list of the updated [lunar notes](../models/lunar/lunar-note.md#lunarnote)

### Successful Response
```json
{
    "error": true,
    "msg": "..."
}
```

### Error Response
```json
{
    "error": true,
    "msg": "..."
}
```

Where the `msg` can take the following values:
- `bad_organization` (the project does not exist within this organization or the organization doesnt exist)
- `bad_body` (the body sent to the POST request was invalid)

## Update Lunar Name
This is the API endpoint that handles updating a lunar refresh project's name.

**URL**: `/update/name` \
**Allows Anonymous Access**: `false` \
**Method**: `POST`

### POST Body
```json
{
    "lunarId": "{user_id}",
    "organizationId": "{organization_id}",
    "projectId": "{project_id}",
    "name": "new name"
}
```

### Successful Response
```json
{
    "error": true,
    "msg": "..."
}
```

### Error Response
```json
{
    "error": true,
    "msg": "..."
}
```

Where the `msg` can take the following values:
- `bad_organization` (the project does not exist within this organization or the organization doesnt exist)
- `bad_body` (the body sent to the POST request was invalid)