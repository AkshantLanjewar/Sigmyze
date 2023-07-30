import { useContext, useEffect, useMemo, useState } from "react"
import { QuantaDatasetManagerData } from "../../../../ui/quanta-dataset-manager"
import { IDatasetCacheObject, IDatasetManagerState } from "../../../../ui/quanta-dataset-manager/types"
import { IQuantaEditorProject } from "../../../../data/quanta/types/project"
import QuantaEditor from "../../../../quanta/quanta-editor/quanta-editor"
import QuantaContext from "../../../../data/quanta/context"


interface IPublicNodeViewProps {
    datasetId: string,
    editorType: "get" | "update"
}

const PublicNodeView: React.FC<IPublicNodeViewProps> = ({ datasetId, editorType }) => {
    //this is the elements we need for the node editor
    const [editor, setEditor] = useState<IQuantaEditorProject | undefined>(undefined)
    const [primed, setPrimed] = useState<IDatasetCacheObject | undefined>(undefined)

    const { fetchDatasetEditor, primeDataset } = useContext(QuantaDatasetManagerData) as IDatasetManagerState
    
    useEffect(() => {
        async function mainEditor() {
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

        async function primeSet() {
            let newPrimed = await primeDataset(datasetId)
            if(newPrimed === undefined)
                return

            setPrimed({ ...newPrimed })
        }

        mainEditor()
        primeSet()
    }, [datasetId, editorType])

    return (
        <>
            <QuantaContext
                quantaId={null}
                organizationId={null}
                primeData={primed}
            >
                <QuantaEditor
                    fileId="static"
                    fileName="static"
                    viewMode={true}
                    editorData={editor}
                />
            </QuantaContext>
        </>
    )
}

export default PublicNodeView