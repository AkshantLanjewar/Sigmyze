## Introduction
This document should serve as an overview to all of the core models within the ASP.net REST service that has been implemented for the lunar service.

## API Models
The API Models are all base classes needed for an API response, such as a status message, or a basic response. The files in the folder are:
- `APIStatus.cs` (detailed breakdown can be found [here](./api-status.md))
- `Dataset.cs` (detailed breakdown can be found [here](./dataset.md))

## Application Services Models
This is a large group of models, closey related to the requests and responses for information relating to user authentication, organizations, querying datasets, as well as updating the drive. The files in the root folder are:
- `DriveReq.cs` (detailed breakdown can be found [here]())
- `OrganizationResp.cs` (detailed breakdown can be found [here]())
- `ProjectReq.cs` (detailed breakdown can be found [here]())
- `ProjectResp.cs` (detailed breakdown can be found [here]())

### Organization Data
This subfolder contains models related to all project data within the system. Whether they are lunar projects, quanta projects, or any other type of user created info, these models help define them. The files in the root of this folder are:
- `ApplicationServices.cs` (detailed breakdown can be found [here]())
- `DatasetMapping.cs` (detailed breakdown can be found [here]())
- `Document.cs` (detailed breakdown can be found [here]())
- `Drive.cs` (detailed breakdown can be found [here]())
- `Node.cs` (detailed breakdown can be found [here]())
- `NodeData.cs` (detailed breakdown can be found [here]())
- `Organizations.cs` (detailed breakdown can be found [here]())
- `Project.cs` (detailed breakdown can be found [here]())

## Data Models
## Lunar Models
## Maps Models
## User Models