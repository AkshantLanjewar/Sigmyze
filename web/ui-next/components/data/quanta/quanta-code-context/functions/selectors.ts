import { IAuthenticationData } from "../../../user/types"
import { DeleteQuantaCodeProject, GetQuantaSuppository } from "../quanta-code-api"
import { IQuantaCodeShort } from "../types"

const fetchSelectors = async (quantaId: string, token: string): Promise<IQuantaCodeShort[] | undefined> => {
    return await GetQuantaSuppository(token, quantaId)
}

const deleteSelector = async (
    quantaId: string | null, 
    authData: IAuthenticationData | null | undefined, 
    codeId: string,
    toggleFetch: () => void
) => {
    let token = authData?.token
    if(token === undefined || quantaId === null)
        return

    await DeleteQuantaCodeProject(token, quantaId, codeId)
    toggleFetch()
}

export {
    fetchSelectors,
    deleteSelector
}