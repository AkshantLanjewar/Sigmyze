import { Button, Group } from "@mantine/core"
import React from "react"
import { IQuantaControl } from "../types"
import { buildStoreKey } from '../utils'

interface INodeControlProps {
    control: IQuantaControl,
    nodeId?: string
}

const NodeControl: React.FC<INodeControlProps> = ({ control, nodeId }) => {
    function controlClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        if(nodeId === undefined)
            return

        //backend for the click
        if(control.activates === "store") {
            let key = buildStoreKey(nodeId, control.storeKey!)
            
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