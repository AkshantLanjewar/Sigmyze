import { useContext, useEffect, useState } from "react"
import { v4 } from "uuid"
import { QuantaContextData } from "../../data/quanta/context"
import SchemaViewer from "./schema-viewer"
import { IQuantaSchema, IQuantaSchemaType } from "./types"

interface ISchemaEditorProps {
    schemaId: string
}

const SchemaEditor: React.FC<ISchemaEditorProps> = ({ schemaId }) => {
    const [internalSchema, setInternalSchema] = useState<IQuantaSchema | undefined>(undefined)
    const quantaContext = useContext(QuantaContextData)

    function hydrateSchema(schema: IQuantaSchema) {
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
        }

        let schemaChildren = nSchema.children
        if(schemaChildren !== undefined) {
            for(let i = 0; i < schemaChildren.length; i++) {
                let schema_ = schemaChildren[i]
                let hydrateChild = hydrateSchema(schema_)
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

        quantaSchema = hydrateSchema(quantaSchema)
        setInternalSchema({ ...quantaSchema })
    }, [quantaContext])
    
    return (
        <div>
            {internalSchema && (
                <SchemaViewer
                    parentId={schemaId}
                    schemaNode={internalSchema}
                    light={true}
                />
            )}
        </div>
    )
}

export default SchemaEditor