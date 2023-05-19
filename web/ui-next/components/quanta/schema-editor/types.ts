import { IQuantaTypeRef } from "../quanta-editor/types/types"

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

    quantaType?: IQuantaTypeRef,

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

    focusNode?: boolean,

    /**
     * whether or not the type can be linked to another
     */
    linkable?: boolean,

    /**
     * the schema id for the list of elements that the type can link to
     */
    linkId?: string,

    /**
     * if the type is linked, the id its linked to in the format linkId::schemaId
     */
    linkedTo?: string
}

interface IQuantaSchemaShort {
    name: string,
    type: IQuantaTypeRef,
    id: string
}

export type { 
    IQuantaSchema,
    IQuantaSchemaType,
    IQuantaSchemaShort 
}