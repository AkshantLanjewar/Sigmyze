---
sidebar_position: 1
slug: /root
id: intro
---

# Introduction
This page should serve as a guide to the Sigmyze Repo and general project structure.
The repo is structured as a monorepo as to centralize the codebase for easy collaboration.
A rough size of the entire project structure can be acquired by using the [scc](https://github.com/boyter/scc) tool.
Running the command:
```bash
scc --include-ext js,cs,ts,scss,html,py,md,css,xml,txt,conf,Dockerfile
```
will then return a rough estimation of the project's size.


## Directory Structure
Currently the repository is structured as followed
```
├── Sigmyze/
│   ├── docs/
│   │   ├── Documentation Code
│   ├── SigmyzeCrawler/
│   │   ├── Data Crawlers
│   ├── web/
│   │   ├── ui/
│   │   │   ├── React Application 
│   │   ├── SigmyzeServer/
│   │   │   ├── ASP.NET Core API 
│   │   ├── sigmyze-charting/
│   │   │   ├── Custom Charting Library 
```

## Dev Environment
The core requirements to create a working dev environment are
- Node.JS version 16.14 or above
- Yarn package manager
- dotnet version 6.0 or above
- python version 3.10 or above

### SigmyzeServer Project Setup
To make sure the API works for our dev website, we have to build and
run the SigmyzeServer project. 

```bash
cd web/SigmyzeServer
dotnet restore
```

After running the above code you are now ready to run the SigmyzeServer. Launch it by running `dotnet watch`.

### UI Project Setup
To properly setup the applications React UI requires a little bit of jank.

Steps:
1. First is the setup of the sigmyze-charting library.

    ```bash
    cd web/sigmyze-charting
    yarn install
    yarn build
    yarn link
    ```
2. Now that the Charting Library has been Linked, the UI project can be setup
    
    ```bash
    cd web/ui
    yarn install
    yarn link sigmyze-charting
    ```

After those steps have been completed your dev environment should be setup and ready to go. 
Try it out by running `yarn start`

## Post-Steps
After you have read this document and the Architechture page, feel free to explore the documentation of the different
project components.