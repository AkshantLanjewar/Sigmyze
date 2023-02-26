import { useState } from "react"
import { v4 } from "uuid"
import SchemaViewer from "./schema-viewer"
import { IQuantaSchema } from "./types"

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

const SchemaEditor: React.FC = ({ }) => {
    const [schema, setSchema] = useState(DEMO_SCHEMA)

    function editSchemaNode(nodes: IQuantaSchema[], nodeId: string, method: "create" | "delete", childId?: string) {
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
                        mutableType: false,
                        removeableType: true,
                        nodeId: v4(),
                        hasChildren: false,
                        focusNode: true
                    } as IQuantaSchema

                    node.children.push(newNode)
                }

                if(method === "delete" && childId !== undefined) {
                    let nChilds = []
                    for(let i = 0; i < node.children.length; i++) {
                        let nodeC = node.children[i]
                        if(nodeC.nodeId !== childId)
                            nChilds.push(nodeC)
                    }

                    node.children = nChilds
                }
            }

            if(node.children !== undefined)
                node.children = editSchemaNode(node.children, nodeId, method)
            nNodes.push(node)
        }

        return nNodes
    }

    function createItem(nodeId: string) {
        let nSchema = editSchemaNode([ schema ], nodeId, "create")[0]
        setSchema({ ...nSchema })
    }

    function deleteItem(parentId: string, childId: string) {
        let nSchema = editSchemaNode([schema], parentId, "delete", childId)[0]
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
                deleteItem={deleteItem}
            />
        </div>
    )
}

export default SchemaEditor