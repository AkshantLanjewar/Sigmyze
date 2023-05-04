import { useContext, useEffect, useState } from "react"
import { IIFrameMessage, IPingFrameData, ISchemaItem, ISelectedMessage, ISetSchemaMessage } from "./types"
import { showNotification } from "@mantine/notifications"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import { IQuantaSchema } from "../../schema-editor/types"
import { IQuantaSelectorCode } from "../../../data/quanta/types/project"
import { SelectorPaneContextData } from "../context"
import { ISelectorPaneState } from "../context/types"
import { v4 } from "uuid"

interface ISelectorFrameTesterProps {
    source: string | null,
    selectorId: string
}

const PING_ERROR_CODE = 200
const PING_SUCCESS_CODE = 350

const DEFAULT_SUCCESS_CODE = 120
const DEFAULT_ERROR_CODE = 910

const SCHEMA_ERROR_CODE = 190
const SCHEMA_SUCCESS_CODE = 982

const SelectorFrameTester: React.FC<ISelectorFrameTesterProps> = ({ source, selectorId }) => {
    const [internalSource, setInternalSource] = useState("")
    const [pingStatus, setPingStatus] = useState<number | null>(null)
    const [schemaStatus, setSchemaStatus] = useState<number | null>(null)
    const [defaultStatus, setDefaultStatus] = useState<number | null>(null)

    //internal data for a successful selector
    const [newSchemaName, setNewSchemaName] = useState<string | null>(null)
    const [containerId, setContainerId] = useState<string | null>(null)
    const [schemaItems, setSchemaItems] = useState<ISchemaItem[] | null>(null)
    const [initialValue, setInitialValue] = useState<any | undefined>(undefined)

    //quanta context
    const { getSchema, changeSchema } = useContext(QuantaContextData) as IQuantaState
    const { setSelectorCode, initialized } = useContext(SelectorPaneContextData) as ISelectorPaneState

    function reset() {
        setPingStatus(null)
        setSchemaStatus(null)
        setNewSchemaName(null)
        setContainerId(null)
        setSchemaItems(null)
    }

    useEffect(() => {
        if(pingStatus !== PING_SUCCESS_CODE || schemaStatus !== SCHEMA_SUCCESS_CODE || defaultStatus !== DEFAULT_SUCCESS_CODE)
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
            newChild.nodeId = v4()
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
            sourceCode: internalSource,
            selectorLinks: {},
            defaultValue: JSON.stringify(initialValue)
        }

        setSelectorCode(selectorCode)
        setInternalSource("")
    }, [pingStatus, schemaStatus, defaultStatus])
    
    useEffect(() => {
        if(source === null)
            return
        if(initialized === false)
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

        const defaultTimer = setTimeout(() => {
            showNotification({
                title: "Invalid Schema",
                message: "This schema didnt return a default value",
                color: 'red',
                autoClose: 1000 * 10
            })

            setDefaultStatus(DEFAULT_ERROR_CODE)
        }, 1000 * 120)

        const frameHandler = (event: MessageEvent<any>) => {
            try {
                let parsedMessage: IIFrameMessage = JSON.parse(event.data)
                if(parsedMessage.data === undefined || parsedMessage.function === undefined)
                    return

                let func = parsedMessage.function
                let funcData = parsedMessage.data
                let parsedFunc: any = JSON.parse(funcData)

                switch(func) {
                    case "ping":
                        let pingData = parsedFunc as IPingFrameData
                        if(pingData.sourceId === undefined)
                            return

                        let sourceId = pingData.sourceId
                        if(sourceId === undefined)
                            return

                        clearTimeout(pingTimer)
                        setPingStatus(PING_SUCCESS_CODE)
                        setContainerId(sourceId)
                    case "setSchema":
                        let schemaData = parsedFunc as ISetSchemaMessage
                        if(schemaData.schemaItems === undefined || schemaData.schemaName === undefined)
                            return

                        let schemaName = schemaData.schemaName
                        let schemaComponents = schemaData.schemaItems
                        if(schemaName === undefined)
                            return

                        clearTimeout(schemaTimer)
                        setSchemaStatus(SCHEMA_SUCCESS_CODE)

                        setSchemaItems([ ...schemaComponents ])
                        setNewSchemaName(schemaName)
                    case "selected":
                        let selectedData = parsedFunc as ISelectedMessage
                        let defaultVal = selectedData.data

                        clearTimeout(defaultTimer)
                        setDefaultStatus(DEFAULT_SUCCESS_CODE)
                        setInitialValue(defaultVal)
                    default:
                        break
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