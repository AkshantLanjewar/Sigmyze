import { useContext, useEffect, useState } from 'react'
import PREBUILT_FORMS from '../../prebuilt_forms'
import { QuantaEditorContext } from '../../quanta-editor'
import { IQuantaSocket, IQuantaStoreData, IQuantaStoreItem } from '../../types'
import { validateStoreSocket } from '../../utils'
import styles from '../node-renderer.module.scss'

interface IDynamicOutput {
    output: IQuantaSocket,
    nodeId?: string
}

const DynamicOutput: React.FC<IDynamicOutput> = ({ output, nodeId }) => {
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
            let storeKey = `${nodeId}_${output.storeKey}`
            let store = quantaEditorContext.getStoreValue(storeKey)
            if(store === undefined)
                return quantaEditorContext.createStore(storeKey, output.groupTitle!, PREBUILT_FORMS.createFile)

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

    return (
        <div className={styles.dynamic__node}>
            <div className={styles.title}>{output.groupTitle}</div>
        </div>
    )
}

export default DynamicOutput