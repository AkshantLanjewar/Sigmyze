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
    const { 
        quantaId, 
        categorization, 
        textStore, 
        selectors,
        schemas 
    } = useContext(QuantaContextData) as IQuantaState

    //grab the public token based on the quanta id
    useEffect(() => {

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
            />
        </Modal>
    )
}

export default SelectorViewModal