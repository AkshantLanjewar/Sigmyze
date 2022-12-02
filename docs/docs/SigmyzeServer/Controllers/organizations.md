---
---

# Organizations Controller

**[Protected]** <br />
`api/v1/organizations` <br />

This endpoint is manipulates organizations within the database. 
It Creates, Updates and Deletes organizations if a valid user is authenticated.

### Required Services
| Service              | Service Interface    | Service Description                                      |
|----------------------|----------------------|----------------------------------------------------------|
| Organization Service | IOrganizationService | Service that interfaces with the organization collection |
| Drive Service        | IDriveService        | Service that interfaces with the drive collection        |
| Polis Service        | IPolisService        | Service that interfaces with the service collection      |

## Endpoints

### Get Organizations
This returns all the organizations that the requesting user is a part of. 


```http title="HTTP Request"
GET /api/v1/organizations
```

#### Request Headers
| Key           | Description         |
|---------------|---------------------|
| Authorization | Bearer ${jwt_token} |

#### Response Attributes
| Key           | Type                | Description                               |
|---------------|-------------------- |-------------------------------------------|
| status        | APIStatusMessage    | Status of the controller (not used atm)   |
| organizations | List<Organization\> | List of organizations  |