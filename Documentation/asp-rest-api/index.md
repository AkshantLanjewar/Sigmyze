## Introduction
The ASP.net REST API helps provide the platform with most DB CRUD operations, relating to updating projects, creating data, publishing data, as well as user authentication and management within the platform. Apart from the API endpoints, the service is built using an MVC architecture, which means the application relies on services and control schemas. An overview of the major components within the API, grouped by their category is as follows

**Models**
- `API` (These are all the models related to the base data structures needed for returning an API call)
- `Application Services` (These are the models related to the basic platform operations, such as authentication and creating projects within the drive)
- `Data` (These are the models that return data queried from the server)
- `lunar` (These are all the models relating to the lunar project)
- `maps` (these are all the models used to display maps)
- `user` (these are all the models used to handle users within the platform)

A more detailed breakdown of the models can be found [here](./models/index.md)

**Services**

We can abstract away many common operations to update and query data from the database into services. The services that the rest api implements are:
- `HashService` (service to hash passwords, detailed breakdown can be found [here](./services/auth/hash-service.md))
- `UserService` (service that handles user authentication, detailed breakdown can be found [here](./services/auth/user-service.md))
- `AuthService` (service that handles user information in database, detailed breakdown can be found [here](./services/database/auth-service.md))
- `PublishService` (service that handles publishing and unpublishing Quanta datasets, detailed breakdown can be found [here](./services/database/publish-service.md))
- `QuantaDatasetService` (service that creates anonymous tokens for the websocket service to access quanta datasets, detailed breakdown can be found [here](./services/database/quanta-dataset-service.md))
- `QuantaExecutionService` (service that upload's data for the websocket execution runner, detailed breakdown can be found [here](./services/database/quanta-execution-service.md))
- `DatasetShared` (helper service that can assist with querying data from a quanta dataset)
- `QuantaIndicatorRepository` (service that queries a quanta dataset's indicators, detailed breakdown can be found [here](./services/quanta-indicator-repository.md))
- `DriveRepository` (service that makes updates to the drive on the mongodb, detailed breakdown can be found [here](./services/drive-repository.md))
- `OrganizationRepository` (service that handles the organization system on the DB, detailed breakdown can be found [here](./services/organization-repository.md))
- `ProjectRepository` (service that handles lunar projects (DEPRECATED))
- `QuantaRepository` (service that handles operations on quanta projects, detailed breakdown can be found [here](./services/quanta-repository.md))
- `UserServiceRepository` (service that handles operations on user services within the DB, detailed breakdown can be found [here](./services/user-service-repository.md))
- `LunarRefreshService` (service that handles operations for lunar refresh projects, detailed breakdown can be found [here](./services/lunar-refresh-service.md))
- `CronJobService` (helper to run cron jobs on the server)
- `EmailService` (service to send emails to users, detailed breakdown can be found [here](./services/utility-services/email-service.md))
- `TokenDataService` (service to extract data from a user JWT token)


**Controllers**

URL endpoints are created through the controller model, in which each controller has a url base, with many additional endpoints depending on the desired functionality. The controllers in the rest-api that create endpoints are:
- `AuthController` (controller with user authentication endpoints, detailed breakdown can be found [here](./controllers/auth-controller.md))
- `LunarController` (controller for lunar refresh endpoints, detailed breakdown can be found [here](./controllers/lunar-controller.md))
- `Quanta` (controller for all of the quanta project endpoints)
- `DriveController` (controller for all of the drive endpoints)
- `OrganizationController` (controller for all of the organization endpoints)
- `ProjectController` (controller for all of the project endpoints)
- `QuantaPublicController` (controller for accessing published quanta projects)
- `Dataset` (controller for the endpoints that can access datasets)

A more detailed breakdown of the services can be found [here]()