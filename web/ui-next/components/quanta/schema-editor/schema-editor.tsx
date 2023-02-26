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
    children: []
} as IQuantaSchema

const SchemaEditor: React.FC = ({ }) => {
    return (
        <div>
            <SchemaViewer schemaNode={DEMO_SCHEMA} />
        </div>
    )
}

export default SchemaEditor