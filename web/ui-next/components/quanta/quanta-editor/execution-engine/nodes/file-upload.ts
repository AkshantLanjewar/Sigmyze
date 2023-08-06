import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { v4 } from "uuid";
import { IQuantaFormField } from "../../types/form";
import { IQuantaRFEdge } from "../../types/types";
import { IEngineModalProps } from "../engine-wrapper";
import { ICallStackFunc } from "../types";
import { IInternalStore, IInternalStorePreload } from "./types";
import { UploadProjectData } from "../callstack-api";

interface IUploadDataParam {
    storageToken: string,
}

async function fileUploadNode(
    stack: ICallStackFunc,
    token: string | undefined,
    isFailedNode: (nodeId: string) => boolean,
    getInputEdge: (nodeId: string, socketId: string) => IQuantaRFEdge | undefined,
    getInputValue: (nodeId: string, socketId: string) => void,
    executeFunction: (nodeId: string, functionId: string, outputIds: string[], functionData: any) => Promise<string>
) : Promise<any> {
    let filesUploaded = false
    let inputs = stack.inputs

    let execution_edge = undefined as IQuantaRFEdge | undefined
    let executution_input = undefined as any

    for(let i = 0; i < inputs.length; i++) {
        let input = inputs[i]
        switch(input.id) {
            case "execute_input":
                executution_input = await getInputValue(stack.nodeId, input.id)
                execution_edge = getInputEdge(stack.nodeId, input.id)

                break
            default:
                break
        }
    }

    let promise = new Promise((resolve, reject) => {
        function abort(errorMsg: string) {
            modals.closeAll()
            if(filesUploaded === true)
                return
    
            reject(`file_upload ${errorMsg}`)
        }

        async function submit(forms: IQuantaFormField[], valStore: {[key: string]: any}) {
            let validForm = true
            for(let i = 0; i < forms.length; i++) {
                let form = forms[i]
                let val = valStore[form.id!]
                if(typeof val !== "string")
                    validForm = false
            }
            
            if(!validForm) {
                showNotification({
                    title: "File Upload Error",
                    message: "Please upload all the requested files in the form.",
                    color: 'red',
                    autoClose: 1000 * 3.5
                })
                
                return
            }

            const exit = () => {
                filesUploaded = true
            modals.closeAll()
            resolve("done")
            }

            //TODO: we are replacing the setOutputValue with preloaded inputs and token generateion
            let preloadedInputs = [] as IInternalStorePreload[]
            if(token === undefined) {
                exit()
                return
            }

            for(let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if(form.linkedKey === undefined)
                    continue
    
                let val = valStore[form.id!]
                let store: IInternalStore = { nodeId: stack.nodeId, socketId: form.linkedKey }
                preloadedInputs.push({
                    store: store,
                    value: val
                })
            }

            let preloadStr = JSON.stringify(preloadedInputs)
            let preloadToken = await UploadProjectData(token, preloadStr)
            if(preloadToken === undefined)
                return

            let nodeId = stack.nodeId
            let functionId = "upload-data"
            let outputIds = [] as string[]
            let functionData: IUploadDataParam = { storageToken: preloadToken }

            let res = await executeFunction(nodeId, functionId, outputIds, functionData)
            if(res !== "success") {
                exit()
                throw new Error(`error in function: ${res}`)
            }

            exit()
        }

        if(execution_edge === undefined) {
            abort("could not find input connection")
            return
        }

        if(isFailedNode(execution_edge.source!)) {
            abort("input nodes failed")
            return
        }

        if(executution_input !== true) {
            abort("missing inputs")
            return
        }

        //find the files we want uploaded
        let dynamicOutputs = stack.dynamicOutputs
        let files = []

        for(let i = 0; i < dynamicOutputs.length; i++) {
            let output = dynamicOutputs[i]
            if(output.type.groupId === "files")
                files.push({
                    linkedId: output.id,
                    name: output.name,
                    fileType: output.type.typeId
                })
        }

        let formComponents = [] as IQuantaFormField[]
        for(let i = 0; i < files.length; i++) {
            let file = files[i]
            formComponents.push({
                type: "file",
                fileType: file.fileType,
                name: file.name,
                linkedKey: file.linkedId,
                id: v4()
            })
        }

        modals.openContextModal({
            modal: "engineModal",
            title: "File Upload",
            onClose: () =>  abort("files not uploaded"),
            centered: true,
            exitTransitionDuration: 250,
            innerProps: {
                forms: formComponents,
                submit: (forms, valStore) => submit(forms, valStore)
            } as IEngineModalProps
        })
    })

    return promise
}

export default fileUploadNode