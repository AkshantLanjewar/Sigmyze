# Drive Controller

**[Protected]** <br />
`api/v1/drive` <br />

This endpoint handles all operations relating to the Drive.
It handles the creation, updating and deleting of both projects and folders.

| Service              | Service Interface                             | Service Description                                         |
|----------------------|----------------------                         |----------------------------------------------------------   |
| Token Data Service   | [ITokenDataService](../Services/ITokenDataService.md) | Service that handles the extraction of data from jwt tokens |
| Drive Service        | [IDriveService](../Services/IDriveService.md) | Service that interfaces with the drive collection           |

### Required HTTP Headers
Since this is a protected route each request needs certain HTTP headers
which are detailed below

| Key           | Description         |
|---------------|---------------------| 
| Authorization | Bearer ${jwt_token} |

## Endpoints

### Get Drive
This endpoint gets the Drive based on the lunar_id in the provided JWT token.

```http title="HTTP Request"
GET /api/v1/organizations
```

#### Response Object
| Key           | Type                                                | Description                                           |
|---------------|--------------------                                 |-------------------------------------------            |
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the request                                 |
| drive         | [Drive](../Models/UserData/drive.md)                | Result of the drive to be sent (TODO Dehydrate drive) |

### Get Project
This endpoint gets a project based on its project_id from the url parameters.

```http title="HTTP Request"
GET /api/v1/organizations/projects/{project_id}
```

#### Request Parameters
| Key             | Description                                                        |
|---------------  |---------------------                                               |
| project_id      | The id for the respective [project](../Models/UserData/project.md) |


#### Response Object
| Key           | Type                                                   | Description                               |
|---------------|--------------------                                    |-------------------------------------------|
| project       | [Project](../Models/UserData/project.md)               | The requested project (can be null)       |

### Create Folder
This endpoint creates a new folder from the given post parameters

```http title="HTTP Request"
POST /api/v1/organizations/create-folder
```

#### Request Body (JSON Format)
| Key             | Type               | Description                                                                |
|---------------  |--------------------|-------------------------------------------                                 |
| directory       | string             | This is the id of the directory the folder is to be created in.            |
| folder_name     | string             | This is the name of the folder to be created                               |
| organization_id | string             | This is the organization_id where the folder is to be created, can be null |

#### Response Object
| Key           | Type                                                | Description                                           |
|---------------|--------------------                                 |-------------------------------------------            |
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the request                                 |
| drive         | [Drive](../Models/UserData/drive.md)                | Result of the drive to be sent (TODO Dehydrate drive) |

### Create Project
This endpoint creates a new project from the given post parameters.

```http title="HTTP Request"
POST /api/v1/organizations/create-project
```

#### Request Body (JSON Format)
| Key             | Type               | Description                                                                  |
|---------------  |--------------------|-------------------------------------------                                   |
| directory       | string             | This is the id of the directory the folder is to be created in.              |
| project_name    | string             | This is the name of the proejct that is to be created                        |
| project_type    | string             | This is the type of project to be created, currently only one type available |
| organization_id | string             | This is the organization_id where the project is to be created, can be null   |

#### Response Object
| Key           | Type                                                | Description                                           |
|---------------|--------------------                                 |-------------------------------------------            |
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the request                                 |

### Update Project
This endpoint updates a project with new data from the post parameters.

```http title="HTTP Request"
POST /api/v1/organizations/update-project
```
#### Request Body (JSON Format)
| Key             | Type                                     | Description                                                     |
|---------------  |--------------------                      |-------------------------------------------                      |
| directory       | string                                   | This is the id of the directory the folder is to be created in. |
| project_id      | string                                   | This is the id of the project to be updated                     |
| project         | [Project](../Models/UserData/project.md) | This is the project data that is going to be replaced           |
| organization_id | string             | This is the organization_id where the project is to be updated, can be null           |

#### Response Object
| Key           | Type                                                | Description                                           |
|---------------|--------------------                                 |-------------------------------------------            |
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the request                                 |

### Update Folder
This endpoints a folder with new data from the post parameters.

```http title="HTTP Request"
POST /api/v1/organizations/update-folder
```

#### Request Body (JSON Format)
| Key             | Type                                     | Description                                                     |
|---------------  |--------------------                      |-------------------------------------------                      |
| directory       | string                                   | This is the id of the directory the folder is to be created in. |
| folder_id       | string                                   | This is the id of the folder to be updated                      |
| folder          | [Folder](../Models/UserData/folder.md)   | This is the folder data that is going to be replaced            |
| organization_id | string                      | This is the organization_id where the folder is to be updated, can be null   |

#### Response Object
| Key           | Type                                                | Description                                           |
|---------------|--------------------                                 |-------------------------------------------            |
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the request                                 |

### Delete Folder
This endpoint deletes a folder from the drive.

```http title="HTTP Request"
POST /api/v1/organizations/delete-folder
```

#### Request Body (JSON Format)
| Key             | Type   | Description                                                     |
|---------------  |--------|-------------------------------------------                      |
| directory       | string | This is the id of the directory the folder is to be created in. |
| directory_id    | string | The ID of the folder that is to be deleted                      |

#### Response Object
| Key           | Type                                                | Description                                           |
|---------------|--------------------                                 |-------------------------------------------            |
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the request                                 |

### Delete Project
This endpoint deletes a project from the drive

```http title="HTTP Request"
POST /api/v1/organizations/delete-project
```

#### Request Body (JSON Format)
| Key             | Type                                     | Description                                                     |
|---------------  |--------------------                      |-------------------------------------------                      |
| directory       | string                                   | This is the id of the directory the folder is to be created in. |
| project_id      | string                                   | This is the id of the project to be deleted                     |

#### Response Object
| Key           | Type                                                | Description                                           |
|---------------|--------------------                                 |-------------------------------------------            |
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the request                                 |