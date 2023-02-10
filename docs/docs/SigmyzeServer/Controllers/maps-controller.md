# Maps Controller

**[Public]** <br />
`api/v1/maps` <br />

This endpoint acts as a public access point to the maps demo.
Currently there isnt a developed map API allowing for the creation
of custom maps / cartography.

### Dependent Services
| Service              | Service Interface  | Service Description                                                                      |
|----------------------|------------------  |----------------------------------------------------------                                |
| Dataset Service      | [IDatasetMongoOrm](../Services/IDatasetMongoOrm.md)   | This service handles interfacing with the dataset col |

## Endpoints

### Status Check
This is a status check to see if the endpoint is working or not.

```http title="HTTP Request"
GET /api/v1/maps
```

#### Response Object
| Key           | Type                                                                | Description                               |
|---------------|--------------------                                                 |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)                 | Status of the controller (not used atm)   |

### Get GeoJSON
This endpoint returns the geojson format in which data can be spliced into.

```http title="HTTP Request"
GET /api/v1/maps/geojson
```

#### Response Object
| Key           | Type               | Description                                                       |
|---------------|--------------------|-------------------------------------------                        |
| file          | File               | This endpoint is a file type response, returning the geojson file |

### Get Map Indicator
This retrieves all the data the map needs to display data, based on the request parameters.

```http title="HTTP Request"
GET /api/v1/maps/{dataset}/{indicator_id}
```

#### Request Parameters
| Key             | Description                                |
|---------------  |---------------------                       |
| dataset         | The dataset where the indicator is located |
| indicator_id    | The indicator that is being requested      |

#### Response Object
| Key           | Type                                                                 | Description                               |
|---------------|--------------------                                                  |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md)                  | Status of the controller (not used atm)   |
| data          | List<*EconomicData*>                                                 | List of all the map data collected        |