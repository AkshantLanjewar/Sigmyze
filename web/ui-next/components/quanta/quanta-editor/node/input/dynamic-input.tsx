import { useEffect, useState } from 'react'
import { IQuantaSocket } from '../../types/node-instructions'
import { IQuantaRFNodeData } from '../../types/nodes'
import { compareTypes } from '../../utils'
import styles from '../node-renderer.module.scss'
import InputRenderer from './input-renderer'

interface IDynamicInputProps {
    input: IQuantaSocket,
    nodeId?: string,
    focused?: boolean,
    data?: IQuantaRFNodeData
}

const DynamicInput: React.FC<IDynamicInputProps> = ({ input, nodeId, focused, data }) => {
    const [childSockets, setChildSockets] = useState<IQuantaSocket[]>([])

    useEffect(() => {
        if(input.dynamicSocket !== true)
            return

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
        <div className={styles.dynamic__node}>
            <div className={styles.title}>{input.groupTitle}</div>

            {childSockets.map((step) => (
                <InputRenderer
                    input={step}
                    nodeId={nodeId}
                    focused={focused}
                    data={data}
                />
            ))}
        </div>
    )
}

export default DynamicInput