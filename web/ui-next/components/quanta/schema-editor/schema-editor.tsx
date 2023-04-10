import { useContext, useEffect, useState } from "react"
import { v4 } from "uuid"
import { QuantaContextData } from "../../data/quanta/context"
import SchemaViewer from "./schema-viewer"
import { IQuantaSchema, IQuantaSchemaType } from "./types"

interface ISchemaEditorProps {
    schemaId: string,
    viewOnly?: boolean
}

const SchemaEditor: React.FC<ISchemaEditorProps> = ({ schemaId, viewOnly }) => {
    const [internalSchema, setInternalSchema] = useState<IQuantaSchema | undefined>(undefined)
    const [internalView, setInternalView] = useState(false)

    const quantaContext = useContext(QuantaContextData)

    function hydrateSchema(schema: IQuantaSchema, isView?: boolean) {
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
        }

        let schemaChildren = nSchema.children
        if(schemaChildren !== undefined) {
            for(let i = 0; i < schemaChildren.length; i++) {
                let schema_ = schemaChildren[i]
                let hydrateChild = hydrateSchema(schema_, isView)
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

        quantaSchema = hydrateSchema(quantaSchema, internalView)
        setInternalSchema({ ...quantaSchema })
    }, [quantaContext, internalView])

    useEffect(() => {
        if(viewOnly === undefined)
            return

        setInternalView(viewOnly)
    }, [viewOnly])
    
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