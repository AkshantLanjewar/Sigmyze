import { modals } from "@mantine/modals"
import { ICallStackFunc } from "../types"
import { IQuantaFormField } from "../../types/types"
import { v4 } from "uuid"
import { IEngineModalProps } from "../engine-wrapper"
import { showNotification } from "@mantine/notifications"

function input_file_upload(stack: ICallStackFunc) {
    let filesUploaded = false
    const promise: Promise<string> = new Promise((resolve, reject) => {
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

            //output the values
            let output = { pError: false } as any
            for(let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if(form.linkedKey === undefined)
                    continue
    
                let val = valStore[form.id!]
                output[form.linkedKey] = val
            }

            filesUploaded = true
            modals.closeAll()

            let output_str = JSON.stringify(output)
            resolve(output_str)
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

export { input_file_upload }