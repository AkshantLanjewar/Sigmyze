---
sidebar_position: 2
---

# Technical Architechture

The Website is built around 3 fundamental areas
1. Data Collection
2. Data Manipulation / Storage
3. Application Interface

The unifying glue between the components is the MongoDB Database.
Unlike traditional SQL based databses in which SQL queries must be generated,
MongoDB uses a JSON document based system. Documents are stored and quered from a modified JSON format called BSON.

### Data Collection
Data collection is handled by the `SigmyzeCrawler` project. 
It functions less as a functional crawler but more of a data preprocessor for our database.
Currently (12/1) the only dataset is the WEO dataset, which is downloaded into a XLS format.
It is then parsed into a dataset format for our database, so it can then be processed by the DOTNET backend.

### Data Manipulation (ASP.net)
The core API is created and hosted by leveraging ASP.net core version 6.
Core functionality like user management, dataset handling and data storage are
all implemented in the `SigmyzeServer` project

### Application Interface (React)
The only user interface to the application is provided through React.
The interface currently heavily relies on the UI library [Mantine](mantine.dev/),
which allowed us to develop quickly without wasting time on a unified look and feel for visual components.

Currently (12/1) the app is only interfaceable through a desktop, as steps have not been taken to make it mobile friendly.