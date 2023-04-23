import { Button, Group } from "@mantine/core"
import React, { useContext } from "react"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import { QuantaEditorContext } from "../quanta-editor"
import { IQuantaControl } from "../types/types"
import { buildStoreKey } from '../utils'

interface INodeControlProps {
    control: IQuantaControl,
    nodeId?: string
}

const NodeControl: React.FC<INodeControlProps> = ({ control, nodeId }) => {
    const quantaContext = useContext(QuantaEditorContext)
    const { openModal } = useContext(QuantaContextData) as IQuantaState

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
        <div>
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