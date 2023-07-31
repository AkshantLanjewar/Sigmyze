import { ISelectorLinks } from "../../data/quanta/types/project"
import { IQuantaSchema } from "../schema-editor/types"
import { IQuantaQuery } from "./types"

const buildQuery = (queryData: string, links: ISelectorLinks, querySchema: IQuantaSchema, datasetSchema: IQuantaSchema) => {
    let fieldsToReceive = [] as string[]
    let linkKeys = Object.keys(links)
    let reversedLinks = {} as any

    for(let i = 0; i < linkKeys.length; i++) {
        let key = linkKeys[i]
        let val = links[key]

        fieldsToReceive.push(val)
        reversedLinks[val] = key
    }

    let parsedQueryData = JSON.parse(queryData)
    if(typeof parsedQueryData !== 'object')
        return

    //get the names
    let receivedValues = {} as any
    let querySchemaChildren = querySchema.children
    if(querySchemaChildren === undefined)
        return

    let datasetSchemaChildren = datasetSchema.children
    if(datasetSchemaChildren === undefined)
        return

    for(let i = 0; i < querySchemaChildren.length; i++) {
        let child = querySchemaChildren[i]
        if(child.nodeId === undefined || fieldsToReceive.includes(child.nodeId) === false)
            continue

        let childName = child.name
        if(childName === undefined)
            return

        let parsedValue = parsedQueryData[childName]
        let parsedValueType = typeof parsedValue
        if(parsedValueType !== 'string')
            continue
        
        //get the linked id from the dataset schema
        let datasetNodeId = reversedLinks[child.nodeId]
        let datasetName = undefined

        for(let x = 0; x < datasetSchemaChildren.length; x++) {
            let datasetChild = datasetSchemaChildren[x]
            if(datasetChild.nodeId === datasetNodeId)
                datasetName = datasetChild.name
        }

        if(datasetName === undefined)
            continue

        receivedValues[datasetName] = parsedValue
    }

    //build out the actual query now
    let query = [] as IQuantaQuery[]
    let receivedKeys = Object.keys(receivedValues)

    for(let i = 0; i < receivedKeys.length; i++) {
        let key = receivedKeys[i]
        let val = receivedValues[key]

        let nQuery = {} as IQuantaQuery
        nQuery.fieldKey = key
        nQuery.fieldType = "string"
        nQuery.stringField = val
        query.push(nQuery)
    }

    return query
}

export { buildQuery }