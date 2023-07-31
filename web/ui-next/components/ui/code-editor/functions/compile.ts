import { v4 } from "uuid"
import { IFilesystem } from "../types"
import { showNotification } from "@mantine/notifications"
import { ICompileProjectResult } from "../../../quanta/selector-pane/context/functions"

interface IZipSelectorBody {
    filesystem: IFilesystem
}

interface IZipSelectorResp {
    zipLocation?: string
}

const zipProjectHandler = (
    filesystem: IFilesystem,
    executeSocketFunction: (
        processId: string, 
        nodeId: string, 
        functionId: string, 
        outputIds: string[], 
        functionData: any, 
        cb: (val: string) => void
    ) => string | undefined
) => {
    const promise = new Promise<string | undefined>((resolve, reject) => {
        const resolver = (val: string) => {
            let resp: IZipSelectorResp = JSON.parse(val)
            resolve(resp.zipLocation)
            clearTimeout(timeout)
        }

        let body: IZipSelectorBody = { filesystem }
        let id_field = v4()
        let output_ids = [] as string[]

        executeSocketFunction(id_field, id_field, "zip_filesystem", output_ids, body, resolver)

        //timeout incase the function fails and we dont know :(
        const timeout = setTimeout(() => {
            resolve(undefined)
            clearTimeout(timeout)
        }, 1000 * 60 * 1.5)
    })

    return promise
}

interface ICompileProjectLayerBody {
    zipLocation: string
}

const compileProjectLayer = (
    zipLocation: string,
    executeSocketFunction: (
        processId: string, 
        nodeId: string, 
        functionId: string, 
        outputIds: string[], 
        functionData: any, 
        cb: (val: string) => void
    ) => string | undefined
) => {
    const promise = new Promise<string | null>((resolve, reject) => {
        const handler = (val: string) => {
            let parsed: ICompileProjectResult = JSON.parse(val)
            resolve(parsed.htmlOutput)
            clearTimeout(expired)
        }

        let body: ICompileProjectLayerBody = { zipLocation }
        let id_field = v4()
        let output_ids = [] as string[]

        executeSocketFunction(id_field, id_field, "compile_selector_layer", output_ids, body, handler)

        let expired = setTimeout(() => {
            resolve(null)
            clearTimeout(expired)
        }, 1000 * 60 * 5)
    })

    return promise
}

const compileProject = async (
    filesystem: IFilesystem | undefined, 
    socketCreated: boolean,
    executeSocketFunction: (
        processId: string, 
        nodeId: string, 
        functionId: string, 
        outputIds: string[], 
        functionData: any, 
        cb: (val: string) => void
    ) => string | undefined
) => {
    if(filesystem === undefined || socketCreated === false)
        return

    let zipLocation = await zipProjectHandler(filesystem, executeSocketFunction)
    if(zipLocation === undefined) { // failed the tar stage for some reason
        showNotification({
            title: "Compilation Error Error",
            message: `Unable to ZIP Selector, try again after 10 seconds`,
            color: 'red',
            autoClose: 1000 * 10
        })
        
        return
    }

    //compile the project with the passed zip location
    let sourceCode = await compileProjectLayer(zipLocation, executeSocketFunction)
    if(sourceCode === null) {
        showNotification({
            title: "Compilation Error Error",
            message: `Unable to Build Selector, check code for errors`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return
    }

    return sourceCode
}

export { compileProject }