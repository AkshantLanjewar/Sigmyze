---
---

# Organizations Controller

**[Protected]** <br />
`api/v1/organizations` <br />

This endpoint is manipulates organizations within the database. 
It Creates, Updates and Deletes organizations if a valid user is authenticated.

### Dependent Services
| Service              | Service Interface                             | Service Description                                      |
|----------------------|----------------------                         |----------------------------------------------------------|
| Organization Service | [IOrganizationService](../Services/IOrganizationService.md) | Service that interfaces with the organization collection |
| Drive Service        | [IDriveService](../Services/IDriveService.md) | Service that interfaces with the drive collection        |
| Polis Service        | [IPolisService](../Services/IPolisService.md) | Service that interfaces with the service collection      |

### Required HTTP Headers
Since this is a protected route each request needs certain HTTP headers
which are detailed below

| Key           | Description         |
|---------------|---------------------| 
| Authorization | Bearer ${jwt_token} |

## Endpoints

### Get Organizations
This returns all the organizations that the requesting user is a part of. 

```http title="HTTP Request"
GET /api/v1/organizations
```

#### Response Object
| Key           | Type                                                                | Description                               |
|---------------|--------------------                                                 |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)                 | Status of the controller (not used atm)   |
| organizations | List<[Organization](../Models/Organization/organization-model.md)\> | List of organizations  |

### Get Organization
This endpoint returns an organization based off the provided organization id

```http title="HTTP Request"
GET /api/v1/organizations/{organization_id}
```

#### Request Parameters
| Key             | Description                            |
|---------------  |---------------------                   |
| organization_id | The id for the respective organization |

#### Response Object
| Key           | Type                                                         | Description                               |
|---------------|--------------------                                          |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)          | Status of the controller (not used atm)   |
| organization  | [Organization](../Models/Organization/organization-model.md) | Matching organization, null if not found  |
| drive         | [Drive](../Models/UserData/drive.md)                         | Related organization drive                |

### Get Project
This endpoint retreives a project from the requested organization

```http title="HTTP Request"
GET /api/v1/organizations/{organization_id}/projects/{project_id}
```

#### Request Parameters
| Key             | Description                            |
|---------------  |---------------------                   |
| organization_id | The id for the respective organization |
| project_id      | The id for the project being requested |

#### Response Object
| Key           | Type                                                   | Description                               |
|---------------|--------------------                                    |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)    | Status of the controller (not used atm)   |
| project       | [Project](../Models/UserData/project.md)               | The requested project (can be null)       |

### Publish Article
This endpoint publishes a document into the temporary 
[article](../Models/Organization/article.md) queue of the specified Organization

```http title="HTTP Request"
POST /api/v1/organizations/organization/{organization_id}/projects/{project_id}/publish
```

#### Request Parameters
| Key             | Description                            |
|---------------  |---------------------                   |
| organization_id | The id for the respective organization |
| project_id      | The id for the project being requested |

#### Request Body (JSON Format)
| Key           | Type                                         | Description                                             |
|---------------|--------------------                          |-------------------------------------------              |
| article       | [Article](../Models/Organization/article.md) | Published version of document including author and date |

#### Response Object
| Key           | Type                                                   | Description                               |
|---------------|--------------------                                    |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)    | Status of the controller (not used atm)   |

### Approve Article
This endpoint approves an [article](../Models/Organization/article.md), 
moving it from the temporary queue into the final published list

```http title="HTTP Request"
GET /api/v1/organizations/organization/{organization_id}/approve/{published_id}
```

#### Request Parameters
| Key             | Description                            |
|---------------  |---------------------                   |
| organization_id | The id for the respective organization |
| published_id    | The id for the respective article      |

#### Response Object
| Key           | Type                                                   | Description                               |
|---------------|--------------------                                    |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)    | Status of the controller (not used atm)   |

### Deny Article
This endpoint denys an [article](../Models/Organization/article.md), 
removing it from the temporary queue

```http title="HTTP Request"
GET /api/v1/organizations/organization/{organization_id}/deny/{published_id}
```

#### Request Parameters
| Key             | Description                            |
|---------------  |---------------------                   |
| organization_id | The id for the respective organization |
| published_id    | The id for the respective article      |

#### Response Object
| Key           | Type                                                   | Description                               |
|---------------|--------------------                                    |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)    | Status of the controller (not used atm)   |

### Delete Article
This endpoint deletes an [article](../Models/Organization/article.md) from the pubnlished list

```http title="HTTP Request"
GET /api/v1/organizations/organization/{organization_id}/delete/{published_id}
```

#### Request Parameters
| Key             | Description                            |
|---------------  |---------------------                   |
| organization_id | The id for the respective organization |
| published_id    | The id for the respective article      |

#### Response Object
| Key           | Type                                                   | Description                               |
|---------------|--------------------                                    |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)    | Status of the controller (not used atm)   |