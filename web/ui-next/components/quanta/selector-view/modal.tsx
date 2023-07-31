import { Modal } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import DatasetSelectionView from "."
import { CreateQuantaMapping, DeleteQuantaMapping } from "../../data/quanta/dataset-api"
import PreviewControls from "./controls"

interface ISelectorViewModalProps {
    opened: boolean,
    close: () => void,
    selectHandler?: (indicatorId: string) => void
}

const SelectorViewModal: React.FC<ISelectorViewModalProps> = ({ opened, close, selectHandler }) => {    
    const [publicToken, setPublicToken] = useState<string | undefined>(undefined)
    const [selectedIndicator, setSelectedIndicator] = useState<string | undefined>(undefined)
    
    const { 
        quantaId, 
        categorization, 
        textStore, 
        selectors,
        schemas 
    } = useContext(QuantaContextData) as IQuantaState

    //grab the public token based on the quanta id
    useEffect(() => {
        async function createMapping() {
            if(quantaId === null)
                return

            let mapping = await CreateQuantaMapping(quantaId)
            setPublicToken(mapping)
        }

        async function deleteMapping() {
            if(publicToken === undefined)
                return

            await DeleteQuantaMapping(publicToken)
        }

        createMapping()
        return () => { deleteMapping() }
    }, [quantaId])
    
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
                categorization={categorization}
                schemas={schemas}
                textStore={textStore}
                selectors={selectors}
                publicToken={publicToken}
                setSelectedIndicator={setSelectedIndicator}
            />

            <PreviewControls
                selectedIndicator={selectedIndicator}
                selectHandler={selectHandler}
                close={close}
            />
        </Modal>
    )
}

export default SelectorViewModal