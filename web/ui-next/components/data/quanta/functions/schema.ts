import { Dispatch, SetStateAction } from "react"
import { v4 } from "uuid"
import { IQuantaTypeRef } from "../../../quanta/quanta-editor/types/node-type"
import { IQuantaSchema } from "../../../quanta/schema-editor/types"
import { ProjectSchemas } from "../types/project"

const initSchema = (
    parentId: string,
    schemas: ProjectSchemas[],
    setSchemas: Dispatch<SetStateAction<ProjectSchemas[]>>,
    toggleUpdateEditorSchema: () => void
) => {
    let nSchema = {
        name: "dataset_schema",
        nodeId: v4(),
        children: [],
        quantaType: {
            groupId: "schema",
            typeId: "schema"
        }
    } as IQuantaSchema

    for(let i = 0; i < schemas.length; i++)
        if(schemas[i].schemaId === parentId)
            return

    let nSchemaObj = {} as ProjectSchemas
    nSchemaObj.schemaId = parentId
    nSchemaObj.schema = nSchema
    setSchemas([ nSchemaObj, ...schemas ])
}

const createElement = (
    parentId: string,
    nodeId: string,
    datasetSchema: IQuantaSchema | undefined, 
    fieldName: string | undefined,
    setDatasetSchema: (parentId: string, nSchema: IQuantaSchema) => void,
    toggleUpdateEditorSchema: () => void
) => {
    let nDatasetSchema = datasetSchema
    let schemaChildren = nDatasetSchema?.children
    if(schemaChildren === undefined || nDatasetSchema === undefined)
        return

    let schema_name = "field_name"
    let focus_node = true
    if(fieldName !== undefined) {
        schema_name = fieldName
        focus_node = false
    }

    schemaChildren.push({
        name: schema_name,
        nodeId: nodeId,
        quantaType: {
            groupId: "schema",
            typeId: "string"
        },
        focusNode: focus_node
    })

    nDatasetSchema.children = schemaChildren
    setDatasetSchema(parentId, nDatasetSchema)
    toggleUpdateEditorSchema()
}

const editSchema = (
    parentId: string,
    nodeId: string,
    type: "edit_text" | "edit_type", 
    text: string,
    node_type: IQuantaTypeRef | undefined,
    datasetSchema: IQuantaSchema | undefined,
    setDatasetSchema: (parentId: string, nSchema: IQuantaSchema) => void,
    toggleUpdateSchema: () => void,
    toggleUpdateEditorSchema: () => void
) => {
    let nDatasetSchema = datasetSchema
    let schemaChildren = nDatasetSchema?.children
    if(schemaChildren === undefined || nDatasetSchema === undefined)
        return

    for(let i = 0; i < schemaChildren.length; i++) {
        let schemaChild = schemaChildren[i]
        if(schemaChild.nodeId === nodeId)
        {
            if(type === "edit_text")
                schemaChild.name = text
            if(type === "edit_type" && node_type !== undefined)
                schemaChild.quantaType = node_type
        }

        schemaChildren[i] = schemaChild
    }

    nDatasetSchema.children = [ ...schemaChildren ]
    if(nDatasetSchema.nodeId === nodeId && type === "edit_text")
        nDatasetSchema.name = text

    setDatasetSchema(parentId, nDatasetSchema)
    toggleUpdateSchema()
    toggleUpdateEditorSchema()
}

const deleteSchema = (
    parentId: string,
    nodeId: string, 
    datasetSchema: IQuantaSchema | undefined,
    setDatasetSchema: (parentId: string, nSchema: IQuantaSchema) => void,
    toggleUpdateEditorSchema: () => void
) => {
    let nDatasetSchema = datasetSchema
    let schemaChildren = nDatasetSchema?.children
    if(schemaChildren === undefined || nDatasetSchema === undefined)
        return

    let nSchemaChildren = []
    for(let i = 0; i < schemaChildren.length; i++) {
        let schemaChild = schemaChildren[i]
        if(schemaChild.nodeId === nodeId)
            continue

        nSchemaChildren.push(schemaChild)
    }

    nDatasetSchema.children = [ ...nSchemaChildren ]
    setDatasetSchema(parentId, nDatasetSchema)
    toggleUpdateEditorSchema()
}

const unfocusAllSchema = (
    parentId: string,
    datasetSchema: IQuantaSchema | undefined,
    setDatasetSchema: (parentId: string, nSchema: IQuantaSchema) => void
) => {
    let nDatasetSchema = datasetSchema
    let schemaChildren = nDatasetSchema?.children
    if(schemaChildren === undefined || nDatasetSchema === undefined)
        return

    let nSchemaChildren = []
    for(let i = 0; i < schemaChildren.length; i++) {
        let schemaChild = schemaChildren[i]
        schemaChild.focusNode = false
        nSchemaChildren.push(schemaChild)
    }

    nDatasetSchema.children = [ ...nSchemaChildren ]
    setDatasetSchema(parentId, nDatasetSchema)
}

const deleteSchemaObject = (
    parentId: string,
    schemas: ProjectSchemas[],
    setSchemas: Dispatch<SetStateAction<ProjectSchemas[]>>
) => {
    let nSchemas = []
    for(let i = 0; i < schemas.length; i++) {
        let schema = schemas[i]
        if(schema.schemaId === parentId)
            continue
        
        nSchemas.push(schema)
    }

    setSchemas([ ...nSchemas ])
}

const getSchema = (parentId: string, schemas: ProjectSchemas[]) : IQuantaSchema | undefined => {
    let schema = undefined
    for(let i = 0; i < schemas.length; i++) {
        let schema_ = schemas[i]
        if(schema_.schemaId === parentId)
            schema = schema_.schema
    }

    return schema
}

const changeSchema = (
    parentId: string, 
    nSchema: IQuantaSchema,
    schemas: ProjectSchemas[], 
    setSchemas: Dispatch<SetStateAction<ProjectSchemas[]>>,
    toggleUpdateEditorSchema: () => void,
) => {
    let nSchemas = []
    for(let i = 0; i < schemas.length; i++) {
        let schema = schemas[i]
        if(schema.schemaId === parentId)
            schema.schema = nSchema

        nSchemas.push(schema)
    }

    setSchemas([ ...nSchemas ])
    toggleUpdateEditorSchema()
}

export {
    initSchema,
    createElement,
    editSchema,
    deleteSchema,
    getSchema,
    changeSchema,
    deleteSchemaObject,
    unfocusAllSchema
}