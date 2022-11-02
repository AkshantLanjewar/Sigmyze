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
        let projects =  CleanseProjects(data['drive']['projects'])
        let folders  = data['drive']['folders']

        if(folders.length == 0 && projects.length == 0)
            setEmptyDrive(true)
        else {
            setEmptyDrive(false)
            updateDrive(folders, projects)
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
function DeleteProject(organization, functions, jwtToken, projectData) {

}

//LIB
function InsertOrganizationId(organization, post_data) {
    let organizationId = organization['organization_id']
    let userOrganization = organization['user_organization']

    let projectPOST = post_data
    if(organizationId != null && userOrganization == false)
        projectPOST['organization_id'] = organizationId
    return projectPOST
}

export {
    LoadDrive,
    CreateProject,
    CreateFolder,
    UpdateProject,
    UpdateFolder
}