import { showNotification } from "@mantine/notifications"
import { IStatus } from "../../datasets/DatasetsTypes"
import { GET_Cacheless, GenerateOptions, server } from "../../utils"
import { IQuantaCodeShort } from "./types"

interface IGetQuantaSuppositoryResp {
    status?: IStatus,
    items?: IQuantaCodeShort[]
}

async function GetQuantaSuppository(token: string, quanta_id: string) {
    let url = `${server}/api/v2/code/quanta/${quanta_id}/suppository`
    let options = GenerateOptions("GET", token)
    
    try {
        let resp = await GET_Cacheless<IGetQuantaSuppositoryResp>(url, options)
        if(resp.status?.error)
            throw Error(resp.status.msg)
        if(resp.items === undefined)
            throw Error("no_items")

        return resp.items
    } catch(e) {
        showNotification({
            title: "Quanta Error",
            message: `Error when trying to access source, ${e}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return undefined
    }
}

async function CreateQuantaProject(token: string, quanta_id: string, title: string, id: string) {
    const body = {
        title: title,
        selector_id: id
    }

    let url = `${server}/api/v2/code/quanta/${quanta_id}/suppository/create`
    let options = GenerateOptions("POST", token, body)

    try {
        let resp = await GET_Cacheless<IStatus>(url, options)
        if(resp.error)
            throw Error(resp.msg)

        return true
    } catch(e) {
        showNotification({
            title: "Quanta Error",
            message: `Error when trying to access source, ${e}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return false
    }
}

async function DeleteQuantaCodeProject(token: string, quanta_id: string, code_id: string) {
    const body = {
        code_id: code_id
    }

    let url = `${server}/api/v2/code/quanta/${quanta_id}/suppository/delete`
    let options = GenerateOptions("POST", token, body)

    try {
        let resp = await GET_Cacheless<IStatus>(url, options)
        if(resp.error === true)
            throw Error(resp.msg)

        return true
    } catch(e) {
        showNotification({
            title: "Quanta Error",
            message: `Error when trying to access source, ${e}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return false
    }
}

export { 
    GetQuantaSuppository,
    CreateQuantaProject,
    DeleteQuantaCodeProject 
}