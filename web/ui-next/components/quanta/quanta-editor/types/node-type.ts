/**
 * This is a reference to the predefined types,
 * used by components within the editor
 */
interface IQuantaTypeRef {
    /**
     * This is the id of the group the type belongs too
     */
    groupId?: string,

    /**
     * This is the id of the type within the group
     */
    typeId?: string
}

/**
 * This is the object that defines a group of editor types.
 * Definitions found in quanta_types.tsx
 */
interface IQuantaTypeGroup {
    /**
     * Name for the group
     */
    groupName?: string,

    /**
     * Id for the group
     */
    groupId?: string,

    /**
     * List of types within the group
     */
    types?: IQuantaType[]
}

/**
 * This is a type stored in the IQuantaTypeGroup
 */
interface IQuantaType {
    /**
     * Id of the type
     */
    typeId?: string,

    /**
     * Name of the type
     */
    typeName?: string,

    /**
     * Icon for the type
     */
    typeIcon?: JSX.Element,

    /**
     * Description of the type
     */
    typeDescription?: string
}

export type {
    IQuantaTypeRef,
    IQuantaType,
    IQuantaTypeGroup
}