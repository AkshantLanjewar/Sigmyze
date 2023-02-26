type IQuantaSchemaType = "schema" | "string"

interface IQuantaSchema {
    /**
     * name for the schema field
     */
    name?: string,

    /**
     * This is the type of node in the schema
     */
    type?: IQuantaSchemaType,

    /**
     * Whether or not you can change the type of the node
     */
    mutableType?: boolean,

    /**
     * This is whether or not the node can be deleted
     */
    removeableType?: boolean,

    /**
     * id of the node
     */
    nodeId?: string,

    /**
     * Whether or not the node can have children
     */
    hasChildren?: boolean,

    /**
     * children of the node
     */
    children?: IQuantaSchema[],

    focusNode?: boolean
}

export type { 
    IQuantaSchema,
    IQuantaSchemaType 
}