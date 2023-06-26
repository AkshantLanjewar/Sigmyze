import { MutableRefObject, useContext, useEffect, useRef, useState } from "react"
import { IQuantaFormField } from "../quanta-editor/types/types"
import { ICompileProjectResult } from "../selector-pane/context/functions"
import { SelectorPaneContextData } from "../selector-pane/context"
import { ISelectorPaneState } from "../selector-pane/context/types"
import FormBuilder from "../../ui/form-builder/form-builder"
import { ZipArchive } from "@shortercode/webzip"
import { WebContainer } from '@webcontainer/api'

const base64ToBlob = async (base64: string, type = 'application/octet-stream') => 
  fetch(`data:${type};base64,${base64}`)
  .then(res => res.blob())

interface IUploadModalProps {
    closeModal: () => void,
    containerRef: MutableRefObject<WebContainer | null>
}

const UploadModal: React.FC<IUploadModalProps> = ({ closeModal, containerRef }) => {
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
            if(typeof fileBytes !== 'string' || containerRef.current === null)
                return

            async function validate_path(path: string) {
                if(containerRef.current === null)
                    return

                let path_split = path.split('/')
                let built_path = './'

                for(let i = 0; i < path_split.length; i++) {
                    let path_ = path_split[i]
                    if(path_.includes('.') || path.length === 0)
                        continue

                    //check if the path exists
                    built_path += `${path_}/`
                    await containerRef.current.fs.mkdir(built_path, { recursive: true })
                }
            }
            try {
                let bytesBlob = await base64ToBlob(fileBytes)
                const code_archive = await ZipArchive.from_blob(bytesBlob)

                //iterate over manually cuz fk vscode
                const code_iterator = code_archive.files()
                while(true) {
                    let iterator_out = code_iterator.next()
                    if(iterator_out.done === true) {
                        break
                    }

                    let path = `${iterator_out.value[0]}`
                    if(path.includes('.') === false)
                        continue

                    let path_val = await code_archive.get(path)
                    if(path_val === undefined)
                        continue

                    let path_str = await path_val.get_string()    
                    
                    await validate_path(path)
                    await containerRef.current.fs.writeFile(path, path_str)
                }

                const debugStream = new WritableStream({
                    write(data) {
                        console.debug(data)
                    }
                })

                const debugStream_ = new WritableStream({
                    write(data) {
                        console.debug(data)
                    }
                })

                //install and build the project
                const install = await containerRef.current.spawn('yarn')
                install.output.pipeTo(debugStream)
                if(await install.exit !== 0)
                    throw Error("install_error")

                //build the project
                const build = await containerRef.current.spawn("yarn", ["build"])
                build.output.pipeTo(debugStream_)

                if(await build.exit !== 0)
                    throw Error(`build_err ${build.exit}`)

                //get the index html
                let html_output = `./build/index.html`
                let html_value = await containerRef.current.fs.readFile(html_output, 'utf-8')
                setTestSource(html_value)
            } catch (error) { 
                console.log(`err -> ${error}`) 
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