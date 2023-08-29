import { Button, Group } from "@mantine/core"
import React, { useContext } from "react"
import { QuantaEditorContext } from "../quanta-editor"
import { IQuantaControl } from "../types/types"
import { buildStoreKey } from '../utils'
import { QuantaUIContextData } from "../../../data/quanta/ui-context"
import { IQuantaUIState } from "../../../data/quanta/ui-context/state"

interface INodeControlProps {
    control: IQuantaControl,
    nodeId?: string,
    index: number
}

const NodeControl: React.FC<INodeControlProps> = ({ control, nodeId, index }) => {
    const quantaContext = useContext(QuantaEditorContext)
    const { openModal } = useContext(QuantaUIContextData) as IQuantaUIState

    function controlClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        if(nodeId === undefined)
            return

        //backend for the click
        if(control.activates === "store") {
            let key = buildStoreKey(nodeId, control.storeKey!)
            quantaContext?.createStoreModal(key)
        } else if(control.activates === "quanta") {
            let quantaActivation = control.quantaActivation
            if(quantaActivation === "new_field")
                openModal("new_field")
        }
    }

    return (
        <div data-testId={`control-${index}`}>
            <Button
                radius={"xl"}
                variant={'filled'}
                color={"indigo"}
                onClick={(e) => controlClick(e)}
                sx={{
                    minWidth: 300
                }}
            >
                <Group spacing={5} position={"center"}>
                    {React.cloneElement(control.icon!, { size: 16, stroke: 2 })}
                    {control.name}
                </Group>
            </Button>
        </div>
    )
}

export default NodeControl