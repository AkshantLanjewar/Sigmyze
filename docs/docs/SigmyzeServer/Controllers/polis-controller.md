# Polis Controller

**[Public]** <br />
`api/v1/polis` <br />

This endpoint acts ass the public access to the polis collection.
Allows pages to request polis's so that they can present the layouts.

### Dependent Services
| Service              | Service Interface                             | Service Description                                      |
|----------------------|----------------------                         |----------------------------------------------------------|
| Organization Service | [IOrganizationService](../Services/IOrganizationService.md) | Service that interfaces with the organization collection |
| Polis Service        | [IPolisService](../Services/IPolisService.md) | Service that interfaces with the service collection      |

## Endpoints

### Status Check
This is a status check to see if the endpoint is working or not.

```http title="HTTP Request"
GET /api/v1/polis
```

#### Response Object
| Key           | Type                                                                | Description                               |
|---------------|--------------------                                                 |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)                 | Status of the controller (not used atm)   |

### Get Polis
This grabs a public facing polis.

```http title="HTTP Request"
GET /api/v1/polis/get/{polis_id}
```

#### Request Parameters
| Key             | Description                            |
|---------------  |---------------------                   |
| polis_id        | The id for the respective polis        |

#### Response Object
| Key           | Type                                                | Description                               |
|---------------|--------------------                                 |-------------------------------------------|
| status?       | [APIStatusMessage](../Models/api_status_message.md) | Returns API Status if polis not found     |
| polis?        | [Polis](../Models/Polis/polis-model.md)             | Polis view object being returned          |                    