let default_state = {
    user_organization: false,

    organization_id: null,
    organization_admin: null,

    total_organizations: []
}

export default ( state = default_state, action ) => {
    let e_state = state
    let payload = action.payload

    switch(action.type) {
        case "set_organization":
            e_state['user_organization'] = payload.user_organization
            e_state['organization_id'] = payload.organization_id
            e_state['organization_admin'] = payload.organization_admin

            return { ...e_state }
        case "revert_organization":
            e_state['user_organization'] = false
            e_state['organization_id'] = null
            e_state['organization_admin'] = null

            return { ...e_state }
        case "set_organizations":
            e_state['total_organizations'] = payload.organizations
            return { ...e_state }
        default:
            return e_state
    }
}