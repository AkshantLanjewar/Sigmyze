## Introduction
This document should serve as an overview to all of the core models within the ASP.net REST service that has been implemented for the lunar service.

## API Models
The API Models are all base classes needed for an API response, such as a status message, or a basic response. The files in the folder are:
- `APIStatus.cs` (detailed breakdown can be found [here](./api-status.md))
- `Dataset.cs` (detailed breakdown can be found [here](./dataset.md))

## Application Services Models
This is a large group of models, closey related to the requests and responses for information relating to user authentication, organizations, querying datasets, as well as updating the drive. The files in the root folder are:
- `DriveReq.cs` (detailed breakdown can be found [here](./application-services/drive-req.md))
- `OrganizationResp.cs` (detailed breakdown can be found [here](./application-services/organization-resp.md))
- `ProjectReq.cs` (more detailed breakdown can be found [here](./application-services/project-req.md))
- `ProjectResp.cs` (more detailed breakdown can be found [here](./application-services/project-resp.md))

### Organization Data
This subfolder contains models related to all project data within the system. Whether they are lunar projects, quanta projects, or any other type of user created info, these models help define them. The files in the root of this folder are:
- `ApplicationServices.cs` (DEPRECATED)
- `DatasetMapping.cs` (detailed breakdown can be found [here](./application-services/organization-data/dataset-mapping.md))
- `Document.cs` (DEPRECATED)
- `Drive.cs` (detailed breakdown can be found [here](./application-services/organization-data/drive.md))
- `Node.cs` (DEPRECATED)
- `NodeData.cs` (DEPRECATED)
- `Organizations.cs` (detailed breakdown can be found [here](./application-services/organization-data/organization.md))
- `Project.cs` (DEPRECATED)

#### Quanta
Since the amount of models required to ingest custom data into the system is quite large, this subfolder contains all of the models relating to quanta projects within the editor. The files in this folder are:
- `DatasetQuery.cs` (detailed breakdown can be found [here](./application-services/quanta/dataset-query.md))
- `Quanta.cs` (detailed breakdown can be found [here](./application-services/quanta/quanta.md))
- `QuantaEditor.cs` (detailed breakdown can be found [here](./application-services/quanta/quanta-editor.md))
- `QuantaExecution.cs` (detailed breakdown can be found [here](./application-services/quanta/quanta-execution.md))
- `QuantaIndicator.cs` (detailed breakdown can be found [here](./application-services/quanta/quanta-indicator.md))
- `QuantaQuery.cs` (detailed breakdown can be found [here](./application-services/quanta/dataset-query.md))
- `QuantaSchema.cs` (detailed breakdown can be found [here](./application-services/quanta/quanta-schema.md))

### Queries
This folder contains all of the models needed to query the quanta system. The files in the root of this folder are:
- `ExecutionQuery.cs` (detailed breakdown can be found [here](./application-services/queries/execution-queries.md))
- `QuantaQueries.cs` (detailed breakdown can be found [here](./application-services/queries/quanta-queries.md))

### UserData
These are the models used to correctly implement the organization system. The files in the root of this folder are:
- `LinkedServices.cs` (detailed breakdown can be found [here]())
- `LinkedUserServices.cs` (detailed breakdown can be found [here]())

## Data Models
## Lunar Models
## Maps Models
## User Models