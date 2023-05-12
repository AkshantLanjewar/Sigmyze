import { IQuantaCategorization } from "../../data/quanta/types/project"
import { IQuantaSchema } from "../schema-editor/types"
import { IPipelineAnalysis } from "../selector-pane/context/types"
import { IQuantaQuery } from "./types"

const parseIncomingQuery = (
    query: IQuantaQuery[],
    categorization: IQuantaCategorization | undefined,
    pipelineLinks: {[key: string]: string} | undefined,
    getSchema: (parentId: string) => IQuantaSchema | undefined
) => {
    let parsedQuerys = [] as IQuantaQuery[]
    for(let i = 0; i < query.length; i++) {
        let queryObject = query[i]
        switch(queryObject.fieldKey) {
            //reserved word
            case "category":
                let schemaName = pipelineLinks?.category
                if(typeof schemaName === 'string')
                    queryObject.fieldKey = schemaName
                else if(typeof schemaName !== 'string' && categorization !== undefined) {
                    let categoriesMap = categorization.categoriesMap
                    let category = queryObject.stringField
                    let mapsTo = categorization.mapsTo
                    if(categoriesMap === undefined || category === undefined || mapsTo === undefined)
                        continue

                    let mapKeys = Object.keys(categoriesMap)
                    let schemaChildren = getSchema("dataset")?.children
                    if(mapKeys.includes(category) === false || schemaChildren === undefined)
                        continue

                    let objName = undefined
                    for(let x = 0; x < schemaChildren.length; x++) {
                        let schema = schemaChildren[x]
                        if(schema.nodeId === mapsTo)
                            objName = schema.name
                    }

                    if(objName === undefined)
                        continue

                    let subcategories = categoriesMap[category]
                    queryObject.multiValue = true
                    queryObject.stringFields = subcategories
                    queryObject.fieldKey = objName
                }

                break
            default:
                break
        }

        parsedQuerys.push(queryObject)
    }

    return parsedQuerys
}

const buildAnalysis = (
    pipelineLinks: {[key: string]: string} | undefined,
    pipelineAnalysis: IPipelineAnalysis[],
    query: IQuantaQuery[] | undefined,
    categorization: IQuantaCategorization | undefined
) => {
    function isReserved(id: string) : string | undefined {
        if(pipelineLinks === undefined)
            return

        let keys = Object.keys(pipelineLinks)
        for(let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let val = pipelineLinks[key]

            if(val === id)
                return key
        }

        return undefined
    }

    let analysis = [] as IPipelineAnalysis[]
    for(let i = 0; i < pipelineAnalysis.length; i++) {
        let analyze = pipelineAnalysis[i]
        let reserved = isReserved(analyze.objectId)
        if(reserved !== undefined)
            analyze.objectId = reserved

        analysis.push(analyze)
    }

    //build the final portions of analysis based on retreived queries now
    let internalQuery = [] as IQuantaQuery[]
    if(query !== undefined)
        internalQuery = query

    for(let i = 0; i < internalQuery.length; i++) {
        let queryItem = internalQuery[i]
        let analyze = {} as IPipelineAnalysis
        if(queryItem.fieldType === "string")
            analyze.objectType = "string"

        analyze.objectId = `query::${queryItem.fieldKey}`
        analyze.stringValue = queryItem.stringField
        analyze.dateValue = queryItem.dateField
        analysis.push(analyze)
    }

    //now we check if the analysis has the categories, otherwise we insert the one from the main page
    let categoriesAnalysis = undefined
    for(let i = 0; i < analysis.length; i++) {
        let object = analysis[i]
        if(object.objectId === "category")
            categoriesAnalysis = object
    }

    //construct a categories analysis object to insert into the analysis if we have a categories from the 
    //context
    if(categoriesAnalysis === undefined && categorization !== undefined) {
        categoriesAnalysis = {} as IPipelineAnalysis
        categoriesAnalysis.objectId = "category"
        categoriesAnalysis.objectType = "string"
        categoriesAnalysis.isArray = true
        categoriesAnalysis.stringArray = categorization.categories

        analysis.push(categoriesAnalysis)
    }

    return analysis
}

export { buildAnalysis, parseIncomingQuery }