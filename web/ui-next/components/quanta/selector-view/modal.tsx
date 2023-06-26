import { Modal } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import DatasetSelectionView from "."
import { IQuantaSchema } from "../schema-editor/types"

interface ISelectorViewModalProps {
    opened: boolean,
    close: () => void
}

const SelectorViewModal: React.FC<ISelectorViewModalProps> = ({ opened, close }) => {
    const [schemas, setSchemas] = useState<IQuantaSchema[]>([])
    
    const { 
        quantaId, 
        categorization, 
        getSchema, 
        textStore, 
        selectors 
    } = useContext(QuantaContextData) as IQuantaState

    useEffect(() => {
        let nSchemas = [] as IQuantaSchema[]
        let datasetSchema = getSchema('dataset')
        if(datasetSchema !== undefined)
            nSchemas.push(datasetSchema)

        setSchemas([ ...nSchemas ])
    }, [])
    
    return (
        <Modal
            title={"Dataset Selection Preview"}
            opened={opened}
            onClose={close}
            size={"60%"}
            centered
            styles={(theme) => ({
                modal: {
                    background: "#101113"
                }
            })}
        >
            <DatasetSelectionView
                quantaId={quantaId}
                categorization={categorization}
                schemas={schemas}
                textStore={textStore}
                selectors={selectors}
            />
        </Modal>
    )
}

export default SelectorViewModal