import { useContext, useEffect, useState } from "react"
import { IIFrameMessage, IPingFrameData, ISchemaItem, ISetSchemaMessage } from "./types"
import { showNotification } from "@mantine/notifications"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import { IQuantaSchema } from "../../schema-editor/types"
import { IQuantaSelectorCode } from "../../../data/quanta/types/project"
import { SelectorPaneContextData } from "../context"
import { ISelectorPaneState } from "../context/types"

interface ISelectorFrameTesterProps {
    source: string | null,
    selectorId: string
}

const PING_ERROR_CODE = 200
const PING_SUCCESS_CODE = 350

const SCHEMA_ERROR_CODE = 190
const SCHEMA_SUCCESS_CODE = 982

const SelectorFrameTester: React.FC<ISelectorFrameTesterProps> = ({ source, selectorId }) => {
    const [internalSource, setInternalSource] = useState("")
    const [pingStatus, setPingStatus] = useState<number | null>(null)
    const [schemaStatus, setSchemaStatus] = useState<number | null>(null)

    //internal data for a successful selector
    const [newSchemaName, setNewSchemaName] = useState<string | null>(null)
    const [containerId, setContainerId] = useState<string | null>(null)
    const [schemaItems, setSchemaItems] = useState<ISchemaItem[] | null>(null)

    //quanta context
    const { getSchema, changeSchema } = useContext(QuantaContextData) as IQuantaState
    const { setSelectorCode } = useContext(SelectorPaneContextData) as ISelectorPaneState

    function reset() {
        setPingStatus(null)
        setSchemaStatus(null)
        setNewSchemaName(null)
        setContainerId(null)
        setSchemaItems(null)
    }

    useEffect(() => {
        if(pingStatus !== PING_SUCCESS_CODE || schemaStatus !== SCHEMA_SUCCESS_CODE)
            return
        if(newSchemaName === null || containerId === null || schemaItems === null)
            return

        let schema = getSchema(selectorId)
        if(schema === undefined)
            return

        let schemaChildren = []
        for(let i = 0; i < schemaItems.length; i++) {
            let schemaItem = schemaItems[i]
            let newChild = {} as IQuantaSchema

            newChild.name = schemaItem.name
            if(schemaItem.type === "string") {
                newChild.type = "string"
                newChild.quantaType = { groupId: "schema", typeId: "string" }
            }
            if(schemaItem.type === "date")
                continue

            schemaChildren.push(newChild)
        }

        schema.name = newSchemaName
        schema.children = schemaChildren
        changeSchema(selectorId, schema)

        //build the selector object
        const selectorCode: IQuantaSelectorCode = {
            containerId: containerId,
            schemaId: selectorId,
            schemaName: newSchemaName,
            schemaItems: schemaItems,
            sourceCode: internalSource
        }

        setSelectorCode(selectorCode)
        setInternalSource("")
    }, [pingStatus, schemaStatus])
    
    useEffect(() => {
        if(source === null)
            return

        setInternalSource(source)
        reset()

        const pingTimer = setTimeout(() => {
            showNotification({
                title: "Invalid Schema",
                message: "This schema didnt return a ping message",
                color: 'red',
                autoClose: 1000 * 10
            })

            setPingStatus(PING_ERROR_CODE)
        }, 1000 * 60)

        const schemaTimer = setTimeout(() => {
            showNotification({
                title: "Invalid Schema",
                message: "This schema didnt return a schema",
                color: 'red',
                autoClose: 1000 * 10
            })

            setSchemaStatus(SCHEMA_ERROR_CODE)
        }, 1000 * 90)

        const frameHandler = (event: MessageEvent<any>) => {
            try {
                let parsedMessage: IIFrameMessage = JSON.parse(event.data)
                if(parsedMessage.data === undefined || parsedMessage.function === undefined)
                    return

                let func = parsedMessage.function
                if(func === "ping") {
                    let funcData = parsedMessage.data
                    let parsedFunc: IPingFrameData = JSON.parse(funcData)
                    if(parsedFunc.sourceId === undefined)
                        return

                    clearTimeout(pingTimer)
                    setPingStatus(PING_SUCCESS_CODE)

                    let sourceId = parsedFunc.sourceId
                    if(sourceId === undefined)
                        return

                    setContainerId(sourceId)
                } if (func === "setSchema") {
                    let funcData = parsedMessage.data
                    let parsedFunc: ISetSchemaMessage = JSON.parse(funcData)
                    if(parsedFunc.schemaItems === undefined || parsedFunc.schemaName === undefined)
                        return

                    clearTimeout(schemaTimer)
                    setSchemaStatus(SCHEMA_SUCCESS_CODE)

                    let schemaName = parsedFunc.schemaName
                    let schemaComponents = parsedFunc.schemaItems
                    if(schemaName === undefined)
                        return

                    setSchemaItems([ ...schemaComponents ])
                    setNewSchemaName(schemaName)
                }
            } catch {
                console.debug("[skipping msg]")
            }
        }

        window.addEventListener("message", (e) => frameHandler(e))

        return () => {
            window.removeEventListener("message", frameHandler)
            clearTimeout(schemaTimer)
            clearTimeout(pingTimer)
        }
    }, [source])
    
    return (
        <>
            <iframe
                style={{ display: "none" }}
                srcDoc={internalSource}
            />
        </>
    )
}

export default SelectorFrameTester