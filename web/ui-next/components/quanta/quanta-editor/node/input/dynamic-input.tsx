import { IconBrandAirtable } from '@tabler/icons'
import { useContext, useEffect, useState } from 'react'
import { QuantaContextData } from '../../../../data/quanta/context'
import { IQuantaState } from '../../../../data/quanta/types'
import { IQuantaSocket } from '../../types/node-instructions'
import { IQuantaRFNodeData } from '../../types/nodes'
import styles from '../node-renderer.module.scss'
import InputRenderer from './input-renderer'
import DynamicInputView from './dynamic-input-view'

interface IDynamicInputProps {
    input: IQuantaSocket,
    nodeId?: string,
    focused?: boolean,
    data?: IQuantaRFNodeData
}

const DynamicInput: React.FC<IDynamicInputProps> = ({ input, nodeId, focused, data }) => {
    const [childSockets, setChildSockets] = useState<IQuantaSocket[]>([])
    const [isSchema, setIsSchema] = useState(false)

    const { getSchema, initSchema, updateEditorSchema, updateSchema } = useContext(QuantaContextData) as IQuantaState

    useEffect(() => {
        if(isSchema === false)
            return

        let schema = getSchema("dataset")
        let schemaNodes = schema?.children
        if(schemaNodes === undefined)
            return

        let dynamicSockets = []
        for(let i = 0; i < schemaNodes.length; i++) {
            let schemaNode = schemaNodes[i]
            let newSocket = {} as IQuantaSocket

            newSocket.type = schemaNode.quantaType
            newSocket.socketId = schemaNode.nodeId
            newSocket.socketName = schemaNode.name
            newSocket.icon = <IconBrandAirtable />
            newSocket.isDatasetField = true
            newSocket.selectableType = true

            dynamicSockets.push(newSocket)
        }

        setChildSockets([ ...dynamicSockets ])
    }, [isSchema, updateEditorSchema, updateSchema])

    useEffect(() => {
        if(input.dynamicSocket !== true)
            return

        if(input.dynamicDepend === "quanta") {
            let quantaDepend = input.quantaDepend
            if(quantaDepend === "schema") {
                //get the schema from quanta context
                setIsSchema(true)
                let schema = getSchema("dataset")
                if(schema === undefined)
                    initSchema("dataset")
            }
        }

        if(input.dynamicDepend === "input_val") {
            let dependentId = input.inputId
            let trackedTypes = data?.types
            let dependentInputs = input.dependentInputs
            if(trackedTypes === undefined || dependentId === undefined || dependentInputs === undefined) 
                return

            let trackedType = null
            for(let i = 0; i < trackedTypes.length; i++) {
                let trackedType_ = trackedTypes[i]
                if(trackedType_.socketId === dependentId)
                    trackedType = trackedType_
            }

            let dependentValue = trackedType?.type
            if(dependentValue === undefined)
                return

            let nChildSockets = null
            for(let i = 0; i < dependentInputs.length; i++) {
                let dependentInput = dependentInputs[i]
                if(dependentInput.inputValue === dependentValue.typeId)
                    nChildSockets = dependentInput.sockets
            }

            if(nChildSockets === null)
                return
            setChildSockets([ ...nChildSockets ])
        }
    }, [input])

    return (
        <DynamicInputView   
            childSockets={childSockets}
            nodeId={nodeId}
            focused={focused}
            input={input}
            data={data}
        />
    )
}

export default DynamicInput