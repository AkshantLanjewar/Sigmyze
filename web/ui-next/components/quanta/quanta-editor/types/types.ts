import { RefObject } from "react"
import { IQuantaFormField } from "./form"
import { IQuantaTypeRef } from "./node-type"
import { IQuantaStoreData } from "./store"

/**
 * TODO: Add edges functionality
 */
interface IQuantaRFEdge {

}

/**
 * Data stored in the editors react context
 */
interface IQuantaEditorGlobals {
    /**
     * Toggle to remove all nodes focus
     * All quanta nodes subscribe to this value in an effect hook
     */
    focusToggle: boolean,

    /**
     * This is the toggle to update the dynamic data subscribed to stores
     */
    storeToggle: boolean,

    /**
     * Function that creates a new node within the editor
     * 
     * @param parentId
     *  the id of the node where the create function was called 
     * @param parentHandle 
     *  the handle where the create menu spawned from
     * @param childType 
     *  this is the new type of node that needs to be created
     * @param handleRef 
     *  this is the ref for the button that spawned the create menu
     */
    createNode: (parentId: string, parentHandle: string, childType: string, handleRef: RefObject<HTMLElement>) => void,

    /**
     * This retreives the store value with a given key
     * @param storeKey 
     *  This is the store key for the store that we are trying to retreive 
     * @returns 
     *  Store data or undefined if it isnt found
     */
    getStoreValue: (storeKey: string) => IQuantaStoreData | undefined,

    /**
     * This function creates a new store in the editor
     * @param storeKey 
     *  key for the store
     * @param storeName 
     *  name for the store
     * @param createFields
     *  the form to create new elements in the store
     */
    createStore: (storeKey: string, storeName: string, createFields: IQuantaFormField[], formTitle: string) => void,
    
    /**
     * This function opens the create item form for a specific store
     * @param modalKey 
     *  the key for the store we want the modal from
     * @returns 
     */
    createStoreModal: (modalKey: string) => void,

    /**
     * This is the function that edits a value within the store
     * @param storeKey 
     *  key for the store being accessed
     * @param itemId 
     *  id of the item we want to edit
     * @param key 
     *  key of the field we are trying to edit
     * @param field 
     *  value we want to replace the previous field with
     */
    editStoreValue: (storeKey: string, itemId: string, key: string, field: any) => void,

    /**
     * This function opens the delete modal in order to ensure the node being deleted is intentional
     * @param nodeId 
     *  the id of the node we want to delete
     */
    deleteNode: (nodeId: string) => void,

    /**
     * this function deletes a node in the editor based on the state set by the delete node
     */
    editorDeleteNode: () => void,

    /**
     * this function deletes an item from the store
     * @param storeKey 
     *  key of the store where we want to delete the item
     * @param itemId 
     *  this is the id of the item we want to delete
     */
    deleteStoreItem: (storeKey: string, itemId: string) => void,

    /**
     * This function activates the focusToggle effects
     * unfocusing all the nodes in the editor
     */
    toggleFocus: () => void,

    /**
     * This function sets up the object to track a sockets type within a node
     * @param nodeId 
     *  the id of the node the socket is a part of
     * @param socketId
     *  this is the id of the socket we are tracking 
     * @param type 
     *  this is the inital type being set in the object
     */
    trackNodeType: (nodeId: string, socketId: string, type: IQuantaTypeRef) => void,
}

export * from './nodes'
export * from './store'
export * from './node-instructions'
export * from './form'
export * from './node-type'

export type {
    IQuantaRFEdge,
    IQuantaEditorGlobals
}