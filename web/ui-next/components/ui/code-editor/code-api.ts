import { showNotification } from "@mantine/notifications";
import { IStatus } from "../../data/datasets/DatasetsTypes";
import { GET_Cacheless, GenerateOptions, server } from "../../data/utils";
import { IFilesystem } from "./types";

interface IGetCodeFilesystemResp {
    status?: IStatus,
    filesystem?: IFilesystem
}

async function GetCodeRepository(token: string, codeId: string) {
    let url = `${server}/api/v2/code/get/${codeId}`
    let options = GenerateOptions("GET", token)

    try {
        let resp = await GET_Cacheless<IGetCodeFilesystemResp>(url, options)
        if(resp.status?.error === true)
            throw Error(resp.status.msg)
        if(resp.filesystem === undefined)
            throw Error("no_filesystem_received")

        return resp.filesystem
    } catch(e) {
        showNotification({
            title: "Code Error",
            message: `Error when trying to access code, ${e}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return undefined
    }
}

export { GetCodeRepository }