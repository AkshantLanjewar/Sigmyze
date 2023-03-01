import { IQuantaFormField } from "./types"

/**
 * This is the store object that stores quanta editor variables
 */
interface IQuantaStore {
    /**
     * stores and accesses data based on a store key
     */
    [key: string]: IQuantaStoreData
}

/**
 * This is the definition for an item within the store
 */
interface IQuantaStoreItem {
    /**
     * Id for the item
     */
    id?: string,

    /**
     * dynamic data holder
     */
    data: any,

    //TODO: Implement schema
    /**
     * keys added to the data
     */
    addedKeys: string[]
}

/**
 * This is the definition for the data stored in the store
 */
interface IQuantaStoreData {
    /**
     * Name of the store
     */
    name?: string,

    /**
     * Items that are stored within the store
     */
    items?: IQuantaStoreItem[],

    /**
     * form field definition for creating a new item
     */
    form?: IQuantaFormField[],

    /**
     * This is the title for the form
     */
    formTitle?: string,
}

export type {
    IQuantaStore,
    IQuantaStoreData,
    IQuantaStoreItem
}