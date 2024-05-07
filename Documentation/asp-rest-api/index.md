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
- `HashService` (service to hash passwords)
- `UserService` (service that handles user authentication)
- `AuthService` (service that handles user information in database)
- `PublishService` (service that handles publishing and unpublishing Quanta datasets)
- `QuantaDatasetService` (service that creates anonymous tokens for the websocket service to access quanta datasets)
- `QuantaExecutionService` (service that upload's data for the websocket execution runner)
- `DatasetShared` (helper service that can assist with querying data from a quanta dataset)
- `QuantaIndicatorRepository` (service that queries a quanta dataset's indicators)
- `DriveRepository` (service that makes updates to the drive on the mongodb)
- `OrganizationRepository` (service that handles the organization system on the DB)
- `ProjectRepository` (service that handles lunar projects (DEPRECATED))
- `QuantaRepository` (service that handles operations on quanta projects)
- `UserServiceRepository` (service that handles operations on user services within the DB)
- `LunarRefreshService` (service that handles operations for lunar refresh projects)
- `CronJobService` (helper to run cron jobs on the server)
- `EmailService` (service to send emails to users)
- `TokenDataService` (service to extract data from a user JWT token)

A more detailed breakdown of the services can be found [here]()

**Controllers**

URL endpoints are created through the controller model, in which each controller has a url base, with many additional endpoints depending on the desired functionality. The controllers in the rest-api that create endpoints are:
- `AuthController` (controller with user authentication endpoints)
- `LunarController` (controller for lunar refresh endpoints)
- `Quanta` (controller for all of the quanta project endpoints)
- `DriveController` (controller for all of the drive endpoints)
- `OrganizationController` (controller for all of the organization endpoints)
- `ProjectController` (controller for all of the project endpoints)
- `QuantaPublicController` (controller for accessing published quanta projects)
- `Dataset` (controller for the endpoints that can access datasets)

A more detailed breakdown of the services can be found [here]()