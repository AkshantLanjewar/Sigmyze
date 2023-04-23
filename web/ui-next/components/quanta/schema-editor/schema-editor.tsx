import { useContext, useEffect, useState } from "react"
import { v4 } from "uuid"
import { QuantaContextData } from "../../data/quanta/context"
import SchemaViewer from "./schema-viewer"
import { IQuantaSchema, IQuantaSchemaType } from "./types"

interface ISchemaEditorProps {
    schemaId: string,
    viewOnly?: boolean,
    linkedSchema?: string
}

const SchemaEditor: React.FC<ISchemaEditorProps> = ({ schemaId, viewOnly, linkedSchema }) => {
    const [internalSchema, setInternalSchema] = useState<IQuantaSchema | undefined>(undefined)
    const [internalView, setInternalView] = useState(false)
    const [internalLinked, setInternalLinked] = useState(false)

    const quantaContext = useContext(QuantaContextData)

    function hydrateSchema(schema: IQuantaSchema, isView?: boolean, isLinked?: boolean) {
        let nSchema = schema
        let schemaType = nSchema.quantaType
        if(schemaType === undefined)
            return

        if(schemaType.typeId === "schema") {
            nSchema.mutableType = false
            nSchema.removeableType = false
            nSchema.hasChildren = true
        } else {
            nSchema.mutableType = true
            nSchema.removeableType = true
            nSchema.hasChildren = false

            if(isView === true) {
                nSchema.mutableType = false
                nSchema.removeableType = false
            } 
            
            if(isLinked === true) {
                nSchema.linkable = true
                nSchema.linkId = linkedSchema
            } else {
                nSchema.linkable = false
                nSchema.linkId = undefined
                nSchema.linkedTo = undefined
            }
        }

        let schemaChildren = nSchema.children
        if(schemaChildren !== undefined) {
            for(let i = 0; i < schemaChildren.length; i++) {
                let schema_ = schemaChildren[i]
                let hydrateChild = hydrateSchema(schema_, isView, isLinked)
                if(hydrateChild === undefined)
                    continue

                schemaChildren[i] = hydrateChild
            }
        }

        nSchema.children = schemaChildren
        return nSchema
    }

    useEffect(() => {
        if(quantaContext === null)
            return

        let quantaSchema = quantaContext.getSchema(schemaId)
        if(quantaSchema === undefined)
        {
            quantaContext.initSchema(schemaId)
            return
        }

        quantaSchema = hydrateSchema(quantaSchema, internalView, internalLinked)
        setInternalSchema({ ...quantaSchema })
    }, [quantaContext, internalView, schemaId, internalLinked])

    useEffect(() => {
        if(viewOnly === undefined)
            return

        setInternalView(viewOnly)
    }, [viewOnly])

    useEffect(() => {
        if(linkedSchema === undefined)
            setInternalLinked(false)
        else
            setInternalLinked(true)
    }, [linkedSchema])
    
    return (
        <div>
            {internalSchema && (
                <SchemaViewer
                    parentId={schemaId}
                    schemaNode={internalSchema}
                    light={true}
                    view={internalView}
                />
            )}
        </div>
    )
}

export default SchemaEditor