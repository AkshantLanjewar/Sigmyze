---
sidebar_position: 1
slug: /root
---

# Introduction
This page should serve as a guide to the Sigmyze Repo and general project structure.
The repo is structured as a monorepo as to centralize the codebase for easy collaboration.
A rough size of the entire project structure can be acquired by using the [scc](https://github.com/boyter/scc) tool.
Running the command:
```
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

Steps:
1. CD into the `web/SigmyzeServer` directory
2. Run the command `dotnet restore`

After those steps you are now ready to run the SigmyzeServer. Launch it by running `dotnet watch`.

### UI Project Setup
To properly setup the applications React UI requires a little bit of jank.

Steps:
1. First is the setup of the sigmyze-charting library.
    1. First install all the dependencies by going into the directory `web/sigmyze-charting` and then run `yarn install`
    2. Then create the production build by running `yarn build`
    3. The final step is creating a sym-link by running `yarn link`
2. Now that the Charting Library has been Linked, the UI project can be setup
    1. Install all the dependencies by running `yarn install`
    2. Add the charting library link by running `yarn link sigmyze-charting`

After those steps have been completed your dev environment should be setup and ready to go. 
Try it out by running `yarn start`