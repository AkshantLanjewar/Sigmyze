let default_state = {
    create_modal: false,
    create_type: "folder",

    //utils
    working_directory: 'root',
    update_drive: false,

    //drive structure
    folders: [],
    projects: [],

    published: [],
    published_queue: []
}

export default ( state = default_state, action ) => {
    let e_state = state
    let payload = action.payload

    switch(action.type) {
        case "set_create_modal":
            let create_type = payload.type
            let modal_state = payload.modal_state

            e_state['create_type']  = create_type
            e_state['create_modal'] = modal_state
            return { ...e_state }
        case "toggle_update":
            e_state['update_drive'] = !e_state['update_drive']
            return { ...e_state }
        case "update_drive":
            let n_folders  = payload.folders
            let n_projects = payload.projects
            let n_queue    = payload.published_queue
            let n_pub      = payload.published

            e_state['folders']         = n_folders
            e_state['projects']        = n_projects
            e_state['published_queue'] = n_queue
            e_state['published']       = n_pub
            return { ...e_state }
        case "change_directory":
            let n_id = payload.folder_id
            e_state['working_directory'] = n_id

            return { ...e_state }
        default:
            return e_state
    }
}