import { showNotification } from "@mantine/notifications";
import { IStatus } from "../../../data/datasets/DatasetsTypes";
import { GET_Cacheless, GenerateOptions, server } from "../../../data/utils";
import { IInternalStorePreload } from "./nodes/types";

async function UploadProjectData(token: string, data: IInternalStorePreload[]) {
    const body = {
        preloadedData: data
    }

    let url = `${server}/api/v2/quanta/execution/preload_data`
    let options = GenerateOptions("POST", token, body)
    let resp = await GET_Cacheless<IStatus>(url, options)

    if(resp.error === true || typeof resp.msg !== 'string') {
        showNotification({
            title: "Execution Error",
            message: "Unable to upload execution data",
            color: 'red',
            autoClose: 1000 * 10
        })

        return
    }

    return resp.msg
}

export { UploadProjectData }