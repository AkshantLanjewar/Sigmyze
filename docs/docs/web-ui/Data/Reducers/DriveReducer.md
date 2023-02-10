# DriveReducer
This is the globally mutable state for the drive.

## Implementation
```js
let default_state = {
    create_modal: false,

    create_type: "folder",

    working_directory: 'root',

    update_drive: false,

    folders: [],

    projects: [],

    published: [],

    published_queue: []
}
```

## Members

### create_modal
`bool`
> This is the state for the modal in charge of creating drive elements.

### create_type
`string`
> This is the type of item that is being created. 
> This affects which form is shown in the create modal.

### working_directory
`string`
> The id of the current active folder. 
> The id for the root folder is `root` <br />
> **Types:** <br />
> **folder** -> This loads the modal form that creates new Folders in the drive.
> **project** -> this loads the modal form that creates new Projects in the drive.

### update_drive
`bool`
> This is a flag to update the drive.
> Components that need to update when the drive updates subscribe to this value changing.

### folders
`List<Folder>`
> This is the list of folders within the root directory.

### projects
`List<Project>`
> This is a list of projects within the root directory.

### published
`List<Article>`
> This is the list of articles that have been published.

### published_queue
`List<Article>`
> This is the queue of articles that need to published or not. 

## Functions (stored in actions)

### OpenCreateModal(type)
> This function opens the modal that handles the creation of drive elements. <br />
> **Props:** <br />
> **type** -> this is the [type](#create_type) of element that is being created

### CloseCreateModal
> This closes the modal that handles the creation of drive elements. <br />

### ToggleDriveUpdate
> This function tells components to re-render/update since the drive state has changed.

### UpdateDrive(payload)
> This function loads all the drive data into state <br />
> **Props:** <br />
> **{ folders, projects, published, published_queue }** -> this is the payload passed to the function. <br />
> **folders** -> This is the new value for the [folders](#folders) state. <br />
> **projects** -> This is the new value for the [projects](#projects) state. <br />
> **published** -> This is the new value for the [published](#published) state. <br />
> **published_queue** -> This is the new value for the [published_queue](#published_queue) state. <br />

### ChangeDirectory(folder_id)
> This function changes the active directory the drive is currently in. <br />
> **Props:** <br />
> **folder_id** -> The folder that the application wants to change into. 