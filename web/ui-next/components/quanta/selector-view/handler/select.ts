import { Dispatch, MutableRefObject, SetStateAction } from "react"
import { ISelectedMessage } from "../../selector-pane/selector-frame-tester/types"
import { IQuantaSchema } from "../../schema-editor/types"
import { ISelectorLinks } from "../../../data/quanta/types/project"
import { IQuantaQuery } from "../../selector-frame/types"

const selectedPublicHandler = async (
    data: string,
    selectorId: string,
    selectorLinks: ISelectorLinks,
    intialSelection: MutableRefObject<boolean>,
    getSchema: (id: string) => IQuantaSchema | undefined,
    setSelectorValue: (selectorId: string, value: string) => void,
    setSelectedIndicator: (indicatorId: string) => void,
) => {
    if(intialSelection.current === false) {
        intialSelection.current = true
        return
    }

    let parsed: ISelectedMessage = JSON.parse(data)
    let schema = getSchema(selectorId)
    let datasetSchema = getSchema('dataset')

    let parsed_data = parsed.data as { [key: string]: any }
    let parsed_data_keys = Object.keys(parsed_data)
    if(parsed_data_keys.includes('indicator_id')) {
        let indicator_id = parsed_data['indicator_id']
        if(typeof indicator_id !== 'string')
            return

        setSelectedIndicator(indicator_id)
        return
    }

    if(schema === undefined || datasetSchema === undefined)
        throw Error("no_schema")
    if(validateSchemaObject(schema, parsed.data) === false)
        throw Error("invalid_data")

    let query = selectionToQuery(
        parsed.data,
        datasetSchema,
        schema,
        selectorLinks
    )

    let queryString = JSON.stringify(query)
    setSelectorValue(selectorId, queryString)
}

//function that converts received selection into query based on the links provided
const selectionToQuery = (
    data: { [key: string]: any },
    datasetSchema: IQuantaSchema,
    selectorSchema: IQuantaSchema,
    selectorLinks: ISelectorLinks
) => {
    let linkKeys = Object.keys(selectorLinks)
    let dataKeys = Object.keys(data)
    let queries = [] as IQuantaQuery[]

    for(let i = 0; i < linkKeys.length; i++) {
        let datasetId = linkKeys[i]
        let schemaId = selectorLinks[datasetId]

        let datasetNode = getNode(datasetSchema, datasetId)
        let schemaNode = getNode(selectorSchema, schemaId)

        if(datasetNode === undefined || schemaNode === undefined)
            continue
        if(schemaNode.name === undefined || datasetNode.name === undefined)
            continue

        let schemaName = schemaNode.name
        if(dataKeys.includes(schemaName) === false)
            continue

        //build the query object
        let query = {} as IQuantaQuery
        query.fieldKey = datasetNode.name
        query.fieldType = "string"
        query.stringField = data[schemaName]
        queries.push(query)
    }

    return queries
}

//util function that receives the specific node in a schema based on its id
const getNode = (schema: IQuantaSchema, nodeId: string) => {
    let node = undefined
    let schemaChildren = schema.children
    if(schemaChildren === undefined)
        return node

    for(let i = 0; i < schemaChildren.length; i++) {
        let child = schemaChildren[i]
        if(child.nodeId === nodeId)
            node = child
    }

    return node
}

//function that validates received selection object with the schema we received
const validateSchemaObject = (schema: IQuantaSchema, data: { [key: string]: any }) => {
    let dataKeys = Object.keys(data)
    let schemaChildren = schema.children
    if(schemaChildren === undefined)
        return false

    for(let i = 0; i < schemaChildren.length; i++) {
        let child = schemaChildren[i]
        let name = child.name
        let type = child.type

        if(name === undefined || type === undefined)
            continue
        if(dataKeys.includes(name) === false)
            return false

        let dataValue = data[name]
        if(typeof dataValue !== type)
            return false
    }

    return true
}

export { selectedPublicHandler }