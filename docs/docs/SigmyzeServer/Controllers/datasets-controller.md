# Datasets Controller

**[Public]** <br />
`api/v1/datasets` <br />

This endpoint acts as an access point to dataset data within the website.
Currently, only public datasets are hosted, and can be queried from the API 
described below.

### Dependent Services
| Service              | Service Interface  | Service Description                                                                      |
|----------------------|------------------  |----------------------------------------------------------                                |
| Dataset Service      | [IDatasetMongoOrm](../Services/IDatasetMongoOrm.md)   | This service handles interfacing with the dataset col |

## Endpoints

### Status Check
This is a status check to see if the endpoint is working or not.

```http title="HTTP Request"
GET /api/v1/datasets
```

#### Response Object
| Key           | Type                                                | Description                               |
|---------------|--------------------                                 |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the controller (not used atm)   |

### Get Objects
This grabs all the objects within the dataset.

```http title="HTTP Request"
GET /api/v1/datasets/{dataset}/objects
```

#### Request Parameters
| Key             | Description                 |
|---------------  |---------------------        |
| dataset         | The dataset being requested |

#### Response Object
| Key           | Type                                                | Description                               |
|---------------|--------------------                                 |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the controller (not used atm)   |
| objects       | List<*DatasetObject*>                               | List of public facing dataset objects     |

### Get Categories
This grabs all the categories for the dataset.

```http title="HTTP Request"
GET /api/v1/datasets/{dataset}/categories
```

#### Request Parameters
| Key             | Description                 |
|---------------  |---------------------        |
| dataset         | The dataset being requested |

#### Response Object
| Key           | Type                                                | Description                               |
|---------------|--------------------                                 |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the controller (not used atm)   |
| categories    | List<*string*>                                      | List of categories                        |

### Get Indicators
This grabs all the indicators within the requested object.

```http title="HTTP Request"
GET /api/v1/datasets/{dataset}/objects/{object_id}/indicators
```

#### Request Parameters
| Key             | Description                          |
|---------------  |---------------------                 |
| dataset         | The dataset being requested          |
| object_id       | The id of the object being requested |

#### Response Object
| Key           | Type                                                   | Description                               |
|---------------|--------------------                                    |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)    | Status of the controller (not used atm)   |
| indicators    | List<*ObjectIndicator*>                                | List of public facing indicator objects   |

### Get Indicator
This grabs a specific indicator from an object in a dataset.

```http title="HTTP Request"
GET /api/v1/datasets/{dataset}/objects/{object_id}/indicators/{indicator_id}
```
#### Request Parameters
| Key             | Description                          |
|---------------  |---------------------                 |
| dataset         | The dataset being requested          |
| object_id       | The id of the object being requested |

#### Response Object
| Key           | Type                                                   | Description                               |
|---------------|--------------------                                    |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)    | Status of the controller (not used atm)   |
| indicator     | [DatasetIndicator](../Models/Data/Indicator.md)        | Indicator data                            |