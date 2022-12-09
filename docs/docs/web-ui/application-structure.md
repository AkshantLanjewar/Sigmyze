# Application Structure
This document will help you get familiriazed with the overall structure of the web application.

## Core Dependencies
- **React**: The core frontend uses react as the main Javascript application ui framework.
With its shadow dom and robust state management, it allows us to create a rich application experience
within the browser.

- **Mantine**: Mantine is a ui component library for React. It speeds up ui design,
while still making it easy to implement a consistent ui theme across the application.

- **Redux**: Redux is a global state management solution for react. This allows react components,
who may not necessarily be parent and child to share component state.

- **React Router**: This library allows the application to create its own routing within the SPA framework.

- **antv/g2**: This is the core data visualization library used.
Developed by ant (alibaba) it provides robust canvas based charts.

- **deck.gl**: This is the library in which interactive maps will be implemented with.
Allows to create graphical layers on top of default map geometry.

## Application Routes

- `/` : BaseShell([Homepage](./Pages/homepage.md))
- `/about` : BaseShell(AboutPage)
- `/indicators` : BaseShell(ResourcesPage)
- `/datasets/:dataset` : BaseShell(DatasetPage)
- `/lunar` : LunarPage
- `/polis/:polisId` : BaseShell(Polis)
- `/polis/:polisId/:layoutId/:dataId` : BaseShell(Polis)
- `/blog` : BaseShell(Polis(sigmyze_root))