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
> The id for the root folder is `root`

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