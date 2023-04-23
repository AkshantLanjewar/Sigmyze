import { useContext, useEffect, useState } from "react"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import QuantaEditor from "../quanta-editor/quanta-editor"

interface IQuantaNodeViewerProps {
    type: "create" | "update"
}

const QuantaNodeViewer: React.FC<IQuantaNodeViewerProps> = ({ type }) => {
    const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined)
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined)
    const [render, setRender] = useState(false)

    const { editorProjects, project_data } = useContext(QuantaContextData) as IQuantaState

    useEffect(() => {
        let projectFiles = project_data?.files
        if(projectFiles === undefined)
            return

        let selectedFile = undefined
        for(let i = 0; i < projectFiles.length; i++) {
            let projectFile = projectFiles[i]
            if(projectFile.name === "Create Dataset" && type === "create")
                selectedFile = projectFile
            if(projectFile.name === "Update Dataset" && type === "update")
                selectedFile = projectFile
        }

        if(selectedFile === undefined || selectedFile.id === undefined || selectedFile.name === undefined)
            return

        setSelectedFile(selectedFile.id)
        setSelectedName(selectedFile.name)
        setRender(true)
    }, [editorProjects])
    
    return (
        <div style={{ width: '100%', height: '100%' }}>
            {render === true && (
                <QuantaEditor
                    fileId={selectedFile!}
                    fileName={selectedName!}
                    viewMode={true}
                />
            )}
        </div>
    )
}

export default QuantaNodeViewer