//LOADING functions
function LoadDrive(organization, jwtToken, functions) {
    const setEmptyDrive = functions['setEmptyDrive']
    const updateDrive = functions['updateDrive']
    const organization_id = organization.organization_id
    const user_organization = organization.user_organization

    let url = `/api/v1/organizations/organization/${organization_id}`
    if(user_organization)
        url = '/api/v1/drive'

    fetch(url, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${jwtToken}`}
    })
    .then(resp => resp.json()).then(data => {
        let projects  =  CleanseProjects(data['drive']['projects'])
        let folders   = data['drive']['folders']
        let pubQueue  = []
        let published = []

        let organization = null
        if('organization' in data)
            organization = data['organization']

        if(organization != null) {
            if('published_queue' in organization)
                pubQueue = organization['published_queue']
            if('published' in organization)
                published = organization['published']
        }

        let payload = {
            folders: folders,
            projects: projects,
            published_queue: pubQueue,
            published: published
        }

        updateDrive(payload)
        if(folders.length == 0 && projects.length == 0)
            setEmptyDrive(true)
        else {
            setEmptyDrive(false)
        }
    })
}

function CleanseProjects(projects) {
    let nProjects = []
    for(let i = 0; i < projects.length; i++) {
        let project = projects[i]
        delete project['project_data']

        nProjects.push(project)
    }

    return nProjects
}

//CREATION functions
function CreateProject(organization, functions, jwtToken, projectData) {
    const toggleUpdateDrive = functions['toggleUpdateDrive']
    const CloseModal = functions['CloseModal']
    let projectPOST = InsertOrganizationId(organization, projectData)

    fetch("/api/v1/drive/create-project", {
        method: "POST",
        body: JSON.stringify(projectPOST),

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
    })
    .then(res => {
        if(res.status !== 200)
            return

        toggleUpdateDrive()
        CloseModal()
    })
}

function CreateFolder(organization, functions, jwtToken, projectData) {
    const toggleUpdateDrive = functions['toggleUpdateDrive']
    const CloseModal = functions['CloseModal']
    let projectPOST = InsertOrganizationId(organization, projectData)

    fetch("/api/v1/drive/create-folder", {
        method: "POST",
        body: JSON.stringify(projectPOST),

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
    })
    .then(res => {
        if(res.status !== 200)
            return

        toggleUpdateDrive()
        CloseModal()
    })
}

// UPDATE functinons
function UpdateProject(organization, functions, jwtToken, projectData) {
    const resCompleted = functions['resCompleted']
    const projectPOST = InsertOrganizationId(organization, projectData)

    fetch("/api/v1/drive/update-project", {
        method: "POST",
        body: JSON.stringify(projectPOST),

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
    })
        .then(res => {
            resCompleted()
        })
}

function UpdateFolder(organization, functions, jwtToken, projectData) {
    const resCompleted = functions['resCompleted']
    const projectPOST = InsertOrganizationId(organization, projectData)

    fetch("/api/v1/drive/update-folder", {
        method: "POST",
        body: JSON.stringify(projectPOST),

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
    })
        .then(res => {
            resCompleted()
        })
}

//DELETE functions
function DeleteItem(type, organization, functions, jwtToken, projectData) {
    const resCompleted = functions['resCompleted']
    const projectPOST = InsertOrganizationId(organization, projectData)

    let url = "/api/v1/drive/delete-project"
    if(type == "folder")
        url = "/api/v1/drive/delete-folder"

    fetch(url, {
        method: "POST",
        body: JSON.stringify(projectPOST),

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
    })
        .then(res => {
            resCompleted()
        })
}

//LIB
function InsertOrganizationId(organization, post_data) {
    let organizationId   = organization['organization_id']
    let userOrganization = organization['user_organization']

    let projectPOST = post_data
    if(organizationId != null && userOrganization == false)
        projectPOST['organization_id'] = organizationId
    if(userOrganization == true)
        projectPOST['organization_id'] = organization.organization_admin

    return projectPOST
}

export {
    LoadDrive,
    CreateProject,
    CreateFolder,
    UpdateProject,
    UpdateFolder,
    DeleteItem
}