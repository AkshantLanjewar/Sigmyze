import { useContext, useEffect, useMemo, useState } from "react"
import { QuantaDatasetManagerData } from "../../../../ui/quanta-dataset-manager"
import { IDatasetManagerState } from "../../../../ui/quanta-dataset-manager/types"
import { IQuantaEditorProject } from "../../../../data/quanta/types/project"
import QuantaEditor from "../../../../quanta/quanta-editor/quanta-editor"


interface IPublicNodeViewProps {
    datasetId: string,
    editorType: "get" | "update"
}

const PublicNodeView: React.FC<IPublicNodeViewProps> = ({ datasetId, editorType }) => {
    //this is the elements we need for the node editor
    const [editor, setEditor] = useState<IQuantaEditorProject | undefined>(undefined)

    const { fetchDatasetEditor } = useContext(QuantaDatasetManagerData) as IDatasetManagerState
    
    useEffect(() => {
        async function main() {
            let editors = await fetchDatasetEditor(datasetId)
            if(editors === undefined)
                return

            let selectedEditor: IQuantaEditorProject | undefined = undefined
            if(editorType === "get")
                selectedEditor = editors.fetchEditor
            else
                selectedEditor = editors.updateEditor

            if(selectedEditor === undefined)
                return

            setEditor({ ...selectedEditor })
        }

        main()
    }, [datasetId, editorType])

    return (
        <QuantaEditor
            fileId="static"
            fileName="static"
            viewMode={true}
            editorData={editor}
        />
    )
}

export default PublicNodeView