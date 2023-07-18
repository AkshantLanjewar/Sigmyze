import { useCallback, useContext, useEffect, useState } from 'react'
import PREBUILT_FORMS from '../../../../ui/form-builder/prebuilt_forms'
import { ExecutionContextData } from '../../execution-engine/context'
import { IExecutionEngineContext } from '../../execution-engine/context/types'
import { QuantaEditorContext } from '../../quanta-editor'
import { IQuantaEditorGlobals, IQuantaSocket, IQuantaStoreItem, IQuantaTypeRef } from '../../types/types'
import { validateStoreSocket, buildStoreKey } from '../../utils'
import DynamicOutputView from './dynamic-view'

interface IDynamicOutput {
    output: IQuantaSocket,
    nodeId?: string,
    focused: boolean,
    parentId?: string
}

const DynamicOutput: React.FC<IDynamicOutput> = ({ output, nodeId, focused, parentId }) => {
    const [renderedOutputs, setRenderedOutputs] = useState<IQuantaSocket[]>([])
    const quantaEditorContext = useContext(QuantaEditorContext) as IQuantaEditorGlobals
    const { executionResults } = useContext(ExecutionContextData) as IExecutionEngineContext

    const buildStoreOutputs = useCallback((storeItems: IQuantaStoreItem[]) => {
        let nOutputs = []
        for(let i = 0; i < storeItems.length; i++) {
            let storeItem = storeItems[i]
            if(validateStoreSocket(storeItem) === false)
                continue

            let nOutput = {} as IQuantaSocket
            nOutput.socketId = storeItem.id

            nOutput.type = storeItem.data.type
            nOutput.icon = storeItem.data.icon
            nOutput.socketName = storeItem.data.name
            nOutput.selectableType = output.selectableType
            nOutput.dynamicSocketTag = true
            
            nOutputs.push(nOutput)
        }

        setRenderedOutputs([ ...nOutputs ])
    }, [output])

    useEffect(() => {
        if(output.dynamicDepend !== "execution")
            return
        if(output.executionField === undefined)
            return

        let executionField = output.executionField
        let executionResult = undefined
        for(let i = 0; i < executionResults.length; i++) {
            let _executionResult = executionResults[i]
            if(_executionResult.nodeId === nodeId && _executionResult.fieldId === executionField)
                executionResult = _executionResult
        }

        if(executionResult === undefined)
            return

        let executionSockets = executionResult.computedSockets
        setRenderedOutputs([ ...executionSockets ])
    }, [executionResults])
    
    useEffect(() => {
        if(quantaEditorContext === null)
            return
        if(nodeId === undefined)
            return
        
        if(output.dynamicDepend === "store") {
            if(output.storeKey === undefined)
                return

            let store = quantaEditorContext.getStoreValue(buildStoreKey(nodeId, output.storeKey))
            if(store === undefined)
                return quantaEditorContext.createStore(
                    buildStoreKey(nodeId, output.storeKey), 
                    output.groupTitle!, 
                    PREBUILT_FORMS.createFile, 
                    "New File"
                )

            let storeItems = store.items
            if(storeItems === undefined)
                return

            buildStoreOutputs(storeItems)
        }
    }, [nodeId])

    useEffect(() => {
        if(quantaEditorContext?.storeToggle === undefined)
            return
        if(output.dynamicDepend !== "store")
            return

        let storeKey = `${nodeId}_${output.storeKey}`
        let store = quantaEditorContext.getStoreValue(storeKey)
        if(store === undefined)
            return

        let storeItems = store.items
        if(storeItems === undefined)
            return

        buildStoreOutputs(storeItems)
    }, [quantaEditorContext?.storeToggle])

    const editType = useCallback((itemId: string, newType: IQuantaTypeRef) => {
        if(nodeId === undefined)
            return
        if(quantaEditorContext === null)
            return
        
        if(output.dynamicSocket === true && output.dynamicDepend === "store") {
            if(output.storeKey === undefined)
                return

            let storeKey = buildStoreKey(nodeId, output.storeKey)
            quantaEditorContext.editStoreValue(storeKey, itemId, "type", newType)
        }
    }, [nodeId, quantaEditorContext, output])

    const deleteStoreField = useCallback((itemId: string) => {
        if(output.storeKey === undefined)
            return
        if(nodeId === undefined)
            return
        if(quantaEditorContext === null)
            return

        let storeKey = buildStoreKey(nodeId, output.storeKey)
        quantaEditorContext.deleteStoreItem(storeKey, itemId)
    }, [output, nodeId, quantaEditorContext])

    return (
        <DynamicOutputView
            renderedOutputs={renderedOutputs}
            output={output}
            nodeId={nodeId}
            parentId={parentId}
            focused={focused}
            editType={editType}
            deleteStoreField={deleteStoreField}
        />
    )
}

export default DynamicOutput