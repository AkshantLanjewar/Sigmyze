import { useCallback, useContext, useEffect, useState } from "react"
import { QuantaContextData } from "../../../../data/quanta/context"
import { IQuantaState } from "../../../../data/quanta/types"
import { QuantaEditorContext } from "../../quanta-editor"
import { IQuantaSocket } from "../../types/node-instructions"
import { IQuantaRFNodeData, IQuantaTypeRef } from "../../types/types"
import InputRendererView from "./input-renderer-view"

interface IInputRendererProps {
    input: IQuantaSocket,
    nodeId?: string,
    focused?: boolean,
    data?: IQuantaRFNodeData
}

const InputRenderer: React.FC<IInputRendererProps> = ({ input, nodeId, focused, data }) => {
    const [localType, setLocalType] = useState<IQuantaTypeRef | undefined>(undefined)
    const [typeUpdated, setTypeUpdate] = useState(false)
    const [controlledSocket, setControlledSocket] = useState<IQuantaSocket | undefined>(undefined)

    const quantaEditorContext = useContext(QuantaEditorContext)
    const { editSchema } = useContext(QuantaContextData) as IQuantaState
    
    useEffect(() => {
        if(nodeId === undefined)
            return
        if(input.socketId === undefined || input.type === undefined)
            return
        if(quantaEditorContext === null)
            return

        if(input.selectableType === true) {
            let nodeTypes = data?.types
            if(nodeTypes === undefined)
            {
                quantaEditorContext.trackNodeType(nodeId, input.socketId, input.type)
                return
            }                
            
            let socketType = null
            for(let i = 0; i < nodeTypes.length; i++) {
                let nodeType = nodeTypes[i]
                if(nodeType.socketId === input.socketId)
                    socketType = nodeType.type
            } 
            
            
            if(socketType === null || socketType === undefined)
            {
                quantaEditorContext.trackNodeType(nodeId, input.socketId, input.type)
                return
            } 
            
            setControlledSocket({ ...input })
            setLocalType({ ...socketType })
        }
    }, [input, data?.types])

    useEffect(() => {
        if(localType === undefined)
            return
        if(controlledSocket === undefined)
            return

        let nControlledSocket = controlledSocket
        nControlledSocket.type = localType
        setControlledSocket({ ...nControlledSocket })
    }, [typeUpdated])

    const editType = useCallback((socketId: string, newType: IQuantaTypeRef) => {
        if(input.selectableType !== true)
            return
        if(localType === undefined)
            return
        if(newType === undefined)
            return
        
        setLocalType({ ...newType })
        setTypeUpdate(!typeUpdated)

        if(nodeId === undefined)
            return
        if(quantaEditorContext === null)
            return

        if(input.isDatasetField === true) {
            editSchema("dataset", socketId, "edit_type", "", newType)
        } else {
            quantaEditorContext.updateTrackedNodeType(nodeId, socketId, newType)
        }
    }, [input, localType, nodeId, quantaEditorContext])

    return (
        <InputRendererView
            controlledSocket={controlledSocket}
            input={input}
            focused={focused}
            nodeId={nodeId}
            data={data}
            localType={localType}
            editType={editType}
        />
    )
}

export default InputRenderer