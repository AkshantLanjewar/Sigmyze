import { useContext, useEffect, useState } from 'react'
import PREBUILT_FORMS from '../../../form-builder/prebuilt_forms'
import { QuantaEditorContext } from '../../quanta-editor'
import { IQuantaSocket, IQuantaStoreData, IQuantaStoreItem, IQuantaTypeRef } from '../../types/types'
import { validateStoreSocket, buildStoreKey } from '../../utils'
import styles from '../node-renderer.module.scss'
import NodeOutput from './node-output'

interface IDynamicOutput {
    output: IQuantaSocket,
    nodeId?: string,
    focused: boolean,
    parentId?: string
}

const DynamicOutput: React.FC<IDynamicOutput> = ({ output, nodeId, focused, parentId }) => {
    const [renderedOutputs, setRenderedOutputs] = useState<IQuantaSocket[]>([])
    const quantaEditorContext = useContext(QuantaEditorContext)

    function buildStoreOutputs(storeItems: IQuantaStoreItem[]) {
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
    }
    
    useEffect(() => {
        if(output.storeKey === undefined)
            return
        if(quantaEditorContext === null)
            return
        if(nodeId === undefined)
            return
        
        if(output.dynamicDepend === "store") {
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

    function editType(itemId: string, newType: IQuantaTypeRef) {
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
    }

    function deleteStoreField(itemId: string) {
        if(output.storeKey === undefined)
            return
        if(nodeId === undefined)
            return
        if(quantaEditorContext === null)
            return

        let storeKey = buildStoreKey(nodeId, output.storeKey)
        quantaEditorContext.deleteStoreItem(storeKey, itemId)
    }

    return (
        <div className={styles.dynamic__node}>
            <div className={styles.title}>{output.groupTitle}</div>

            {renderedOutputs.map((step) => (
                <NodeOutput
                    output={step}
                    nodeId={nodeId}
                    focused={focused}
                    unfocus={() => { }}
                    editType={editType}
                    deleteStoreField={deleteStoreField}
                />
            ))}
        </div>
    )
}

export default DynamicOutput