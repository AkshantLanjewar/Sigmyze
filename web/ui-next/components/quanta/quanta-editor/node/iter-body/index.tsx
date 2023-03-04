import { useContext, useEffect, useState } from "react"
import { v4 } from "uuid"
import { QuantaEditorContext } from "../../quanta-editor"
import { IQuantaRFNodeData, IQuantaRFNodeDataType, IQuantaSocket } from "../../types/types"
import { getDetailedType } from "../../utils"
import InputRenderer from "../input/input-renderer"
import OutputRenderer from "../output/OutputRenderer"

interface IIterBodyProps {
    nodeId?: string,
    types?: IQuantaRFNodeDataType[],
    data?: IQuantaRFNodeData,
    focused: boolean
}

const IterBody: React.FC<IIterBodyProps> = ({ nodeId, types, data, focused }) => {
    const [iterOutputs, setIterOutputs] = useState<IQuantaSocket[]>([])
    const quantaContext = useContext(QuantaEditorContext)

    function getIterType() {
        if(nodeId === undefined)
        {
            setIterOutputs([])
            return
        }
        if(quantaContext === null)
        {
            setIterOutputs([])
            return
        }

        let parentId = quantaContext.getParentId(nodeId)
        if(parentId === undefined)
        {
            setIterOutputs([])
            return
        }

        let edge = quantaContext.getConnectedEdge(parentId, "target")
        if(edge === undefined)
        {
            setIterOutputs([])
            return
        } 
        
        let sourceNodeId = edge.source
        let sourceNodeHandle = edge.sourceHandle
        if(sourceNodeId === undefined || sourceNodeHandle === undefined)
        {
            setIterOutputs([])
            return
        }

        let sourceSocket = quantaContext.getNodeSocket(sourceNodeId, sourceNodeHandle, "output")
        let socketType = sourceSocket?.type
        if(socketType === undefined)
        {
            setIterOutputs([])
            return
        }

        if(types === undefined)
        {
            quantaContext.trackNodeType(nodeId, sourceNodeId, socketType)
            types = []
        }
        
        let trackedSocket = null
        for(let i = 0; i < types.length; i++) {
            let type = types[i]
            if(type.socketId === sourceNodeId)
                trackedSocket = type
        }

        if(trackedSocket === null)
            quantaContext.trackNodeType(nodeId, sourceNodeId, socketType)

        //update the tracked socket
        quantaContext.updateTrackedNodeType(nodeId, sourceNodeId, socketType)
        let detailedSocket = getDetailedType(socketType)
        if(detailedSocket === undefined)
        {
            setIterOutputs([])
            return
        }

        let socket = {} as IQuantaSocket
        socket.socketId = v4()
        socket.type = socketType
        socket.socketName = detailedSocket.typeName
        socket.icon = detailedSocket.typeIcon
        setIterOutputs([ { ...socket } ])
    }

    useEffect(() => {
        getIterType()
    }, [nodeId])

    useEffect(() => {
        getIterType()
    }, [quantaContext?.edgeToggle, quantaContext?.nodeToggle])

    return (
        <>
            {iterOutputs.map((step) => (
                <OutputRenderer
                    output={step}
                    nodeId={nodeId}
                    focused={focused}
                    unfocus={() => {  }}
                />
            ))}
        </>
    )
}

export default IterBody