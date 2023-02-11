import { GenerateOptions, GET_Cacheless, server } from "../utils"
import { IDriveResp, IOrganizationResp } from "./types/HTTP-types"

async function OrganizationApi(token: string) : Promise<IOrganizationResp> {
    let url = `${server}/api/v2/organizations`
    let options = GenerateOptions("GET", token)

    return await GET_Cacheless<IOrganizationResp>(url, options)
}

async function OrganizationDrive(token: string, organization_id: string) : Promise<IDriveResp> {
    let url = `${server}/api/v2/organizations/drive/${organization_id}`
    let options = GenerateOptions("GET", token)

    return await GET_Cacheless<IDriveResp>(url, options)
}

export { 
    OrganizationApi,
    OrganizationDrive 
}