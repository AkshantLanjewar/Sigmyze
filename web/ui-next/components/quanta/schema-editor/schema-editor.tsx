import { useState } from "react"
import { v4 } from "uuid"
import SchemaViewer from "./schema-viewer"
import { IQuantaSchema, IQuantaSchemaType } from "./types"

const DEMO_SCHEMA = {
    name: "demo schema",
    type: "schema",
    mutableType: false,
    removeableType: false,
    nodeId: v4(),
    hasChildren: true,
    focusNode: false,
    children: []
} as IQuantaSchema

type SchemaFunctions = "create" | "delete" | "edit_text" | "edit_type"

const SchemaEditor: React.FC = ({ }) => {
    const [schema, setSchema] = useState(DEMO_SCHEMA)

    function editSchemaNode(
        nodes: IQuantaSchema[], 
        nodeId: string, 
        method: SchemaFunctions,
        additionalText?: string
    ) {
        let nNodes = [] as IQuantaSchema[]
        for(let i = 0; i < nodes.length; i++) {
            let node = nodes[i]
            if(node.children === undefined)
                node.children = []

            if(node.nodeId === nodeId) {
                if(method === "create") {
                    let newNode = {
                        name: "field_name",
                        type: "string",
                        mutableType: true,
                        removeableType: true,
                        nodeId: v4(),
                        hasChildren: false,
                        focusNode: true
                    } as IQuantaSchema

                    node.children.push(newNode)
                }

                if(method === "delete" && additionalText !== undefined) {
                    let nChilds = []
                    for(let i = 0; i < node.children.length; i++) {
                        let nodeC = node.children[i]
                        if(nodeC.nodeId !== additionalText)
                            nChilds.push(nodeC)
                    }

                    node.children = nChilds
                }

                if(method === "edit_text" && additionalText !== undefined)
                    node.name = additionalText

                if(method === "edit_type" && additionalText !== undefined)
                    node.type = additionalText as IQuantaSchemaType
            }

            if(node.children !== undefined)
                node.children = editSchemaNode(node.children, nodeId, method, additionalText)
            nNodes.push(node)
        }

        return nNodes
    }

    function createItem(nodeId: string) {
        let nSchema = editSchemaNode([ schema ], nodeId, "create")[0]
        setSchema({ ...nSchema })
    }

    function editText(nodeId: string, text: string) {
        let nSchema = editSchemaNode([schema], nodeId, "edit_text", text)[0]
        setSchema({ ...nSchema })
    }

    function editSchema(nodeId: string, type: SchemaFunctions, text: string) {
        let nSchema = editSchemaNode([schema], nodeId, type, text)[0]
        setSchema({ ...nSchema })
    }

    function unfocusItems() {
        let nSchema = schema
        nSchema.focusNode = false

        if(nSchema.children === undefined)
            return
        for(let i = 0; i < nSchema.children.length; i++)
            nSchema.children[i].focusNode = false

        setSchema({ ...nSchema })
    }

    return (
        <div>
            <SchemaViewer 
                schemaNode={schema}
                createItem={createItem} 
                unfocusItems={unfocusItems}
                editText={editText}
                editSchema={editSchema}
            />
        </div>
    )
}

export type { SchemaFunctions }
export default SchemaEditor