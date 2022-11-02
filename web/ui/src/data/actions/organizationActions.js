export const SetOrganization = (user_organization, organization_id, organization_admin) => {
    return {
        type: "set_organization",
        payload: {
            user_organization: user_organization,
            organization_id: organization_id,
            organization_admin: organization_admin
        }
    }
}

export const RevertOrganization = () => {
    return {
        type: "revert_organization",
        payload: {

        }
    }
}