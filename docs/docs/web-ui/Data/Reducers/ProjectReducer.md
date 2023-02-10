# ProjectReducer
This is the globally mutable state for the project application ui.  

## Implementation
```js
let default_tab = {
    name: 'Combined Chart',

    icon: "mix",

    editable: false,

    type: 'chart',

    id: uuidv4(),

    indicators: []
}

let default_state = {
    project_name: "",

    project_id: "demo",

    project_data: {
        indicators: [],
        documents:  []
    },

    last_saved: [], //deprecated

    tabs: [default_tab],

    next_tab: "", //deprecated

    content_loaded: false
}
```

## Members

### project_name
`string`
> This is the name of the project, empty if the demo project

### project_id
`string`
> This is the unique id assigned to every project. 
> If no project, id is set to demo.

### project_data
`{ indicators, documents }`
> project_data contains all the data necessary to store a project on the database.

#### indicators (project_data)
`List<Indicator>`
> This is a list of indicators added within the project.

#### documents (project_data)
`List<Document>`
> This is a list of documents created within the project. 

### tabs
`List<Tab>`
> This is a list of opened [tabs](#tab-submember) within the editor.

### content_loaded
`bool`
> This is the flag notifying components the project has been loaded.

### Tab (submember)
The tab holds data on the type of view it contains.

#### name
`string`
> The name of the tab.

#### icon
`string`
> Icon for tab, key for ICON_DICTIONARY.

#### editable
`bool`
> Whether or not the tab can be closed.

#### type
`string`
> The view type for the tab

#### indicators?
`List<Indicator>`
> If this is a chart view, the indicators used.

#### data_loc?
`string`
> This is the id to lookup and edit doucments, if the tab is a document view.

## Functions (stored in actions)

### SetProjectName(project_name)
> This function sets the [project_name](#project_name) value in the state. <br />
> **Props:** <br />
> **project_name** -> The new project_name <br />

### SetProjectID(project_id)
> This function sets the [project_id](#project_id) value in the state. <br />
> **Props:** <br />
> **project_id** -> The new project_id

### AddProjectIndicator(indicator)
> This function adds a new indicator to the chart. <br /> 
> **Props:** <br /> 
> **indicator** -> `{ dataset, object_id, indicator_id }` <br />
> **dataset(indicator)** -> The dataset for the indicator. <br />
> **object_id(indicator)** -> The object_id for the indicator. <br />
> **indicator_id(indicator)** -> The indicator_id for the indicator. <br />

### RemoveIndicator(indicator_id, object_id)
> This function removes an indicator from the project based on its
> indicator_id and its object_id. <br />
> **Props:** <br />
> **indicator_id** -> This is the indicator_id for the indicator to be deleted. <br />
> **object_id** -> This is the object_id for the indicaor to be deleted. <br />

### RemoveAllIndicators()
> This function completely removes all the indicators from the project.

### HideTab(tab_id)
> This function deletes a tab from the active tab list. <br />
> **Props:** <br />
> **tab_id** -> This is the tab_id for the tab that is to be deleted. 

### OpenChartTab(dataset, object_id, indicator_id)
> This function adds a chart to the project and opens a new tab as well. <br />
> **Props:** <br />
> **dataset** -> This is the dataset that the indicator is in.  <br />
> **object_id** -> This is the object_id for the indicator. <br />
> **indicator_id** -> This is the indicator_id for the indicator.

### OpenDocumentTab(document_name, data_location)
> This function opens a new document based on the provided data_location.<br />
> **Props:** <br />
> **document_name** -> The name of the document being opened. <br />
> **data_location** -> The search parameter for fetching the document. <br />

### OpenPublishingTab(document_name, document_id)
> This function opens the publishing view to publish a document into an article.<br />
> **Props:** <br />
> **document_name** -> The name of the document being published<br />
> **document_id** -> The id of the document being published <br />

### CreateDocument(document_id, document_name, document_content, data_location)
> This function creates a new document from the given parameters. <br />
> **Props:** <br />
> **document_id** -> the generated document_id for the new document <br />
> **document_name** -> The name for the new document <br />
> **document_content** -> The initial content for the new document <br />
> **data_location** -> This is the generated data_location 

### RemoveDocument(document_id, document_name)
> This function deletes a document from the project based on the given props.  <br />
> **Props:** <br />
> **document_id** -> this is the id of the document to be deleted. <br />
> **document_name** -> this is the name of the document to be deleted. <br />

### SetDocumentContent(blocks, document_location)
> This function sets the content of a document. <br />
> **Props:** <br />
> **blocks** -> this is the new set of blocks for the document. <br />
> **document_location** -> the document location for the document to be updated. <br />

### LoadProject(name, id, indicators, documents)
> This function loads the project data into the application state. <br />
> **Props:** <br />
> **name** -> this sets the [project_name](#project_name) property. <br />
> **id** -> this sets the [project_id](#project_id) property. <br />
> **indicators** -> this sets the [indicators](#indicators-project_data) property. <br />
> **documents** -> this sets the [documents](#documents-project_data) property. <br />

### DefaultProject()
> This function sets the project to state to the demo state.