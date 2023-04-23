import { SetStateAction } from "react";
import { OrganizationApi } from "../organization-api";
import { IOrganization } from "../types";

async function GetOrganizations(
    token: string,
    setOrganizations: (value: SetStateAction<IOrganization[]>) => void
) {
    let resp = await OrganizationApi(token)
    let organizations = resp.organizations
    if(organizations === undefined)
        return

    setOrganizations([ ...organizations ])
}

export { GetOrganizations }