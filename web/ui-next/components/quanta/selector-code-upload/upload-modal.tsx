import { useContext, useState } from "react"
import { IQuantaFormField } from "../quanta-editor/types/types"
import { ICompileProjectResult } from "../selector-pane/context/functions"
import { SelectorPaneContextData } from "../selector-pane/context"
import { ISelectorPaneState } from "../selector-pane/context/types"
import FormBuilder from "../../ui/form-builder/form-builder"

interface IUploadModalProps {
    closeModal: () => void
}

const UploadModal: React.FC<IUploadModalProps> = ({ closeModal }) => {
    const [loadingStr, setLoadingStr] = useState<string | undefined>(undefined)
    const { compileProject, initialized, setTestSource } = useContext(SelectorPaneContextData) as ISelectorPaneState
    
    const formComponents = [
        {
            type: "file",
            fileType: "zip",
            name: "Source Code",
            linkedKey: "source",
            id: "source"
        }
    ] as IQuantaFormField[]

    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        if(initialized !== true) {
            setLoadingStr(undefined)
            return
        }

        async function main() {
            let fileBytes = valStore['source']
            if(typeof fileBytes !== 'string')
                return

            let result: ICompileProjectResult = await compileProject(fileBytes)
            if(result.error === true) {

            } else {
                let htmlSource = result.htmlOutput
                setTestSource(htmlSource)

                htmlSource = null
                result.htmlOutput = null
            }

            setLoadingStr(undefined)
            closeModal()
        }

        setLoadingStr('loading')
        main()
    }
    
    return (
        <>
            <FormBuilder
                forms={formComponents}
                submit={submit}
                closeModal={closeModal}
                loadingStr={loadingStr}
            />
        </>
    )
}

export default UploadModal