import { RefObject } from "react"
import { IQuantaRFEdge } from "./edges"
import { IQuantaFormField } from "./form"
import { IQuantaSocket } from "./node-instructions"
import { IQuantaTypeRef } from "./node-type"
import { IQuantaRFNode } from "./nodes"
import { IQuantaStoreData } from "./store"

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
     * when edges are updated within the editor
     */
    edgeToggle: boolean,

    /**
     * when nodes are updated within the editor
     */
    nodeToggle: boolean,

    /**
     * this is the type for the editor, whether the script is creating into the dataset
     * or updating an already existing dataset
     */
    editorType: "create" | "update",

    /**
     * this is the file id for the editor
     */
    fileId: string,

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
    createNode: (
        parentId: string, 
        parentHandle: string, 
        childType: string, 
        handleRef: RefObject<HTMLElement>, 
        groupId?: string
    ) => void,

    /**
     * this function creates an iterable node loop
     * @param parentId
     *  the id of the node where the create function was called 
     * @param parentHandle 
     *  the handle where the create menu spawned from
     * @param handleRef 
     *  this is the ref for the button that spawned the create menu
     */
    createIter: (parentId: string, parentHandle: string, handleRef: RefObject<HTMLElement>) => void,

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
    deleteNode: (nodeId: string, backend?: string) => void,

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

    /**
     * This function updates the type of a tracked type within the node
     * @param nodeId 
     *  the id of the node the socket is a part of
     * @param socketId
     *  this is the id of the socket we are tracking 
     * @param type 
     *  this is the new type being set
     */
    updateTrackedNodeType: (nodeId: string, socketId: string, type: IQuantaTypeRef) => void,

    /**
     * This gets the edges connected to a specific node
     * @param nodeId 
     *  id of the node we are looking up
     */
    getConnectedEdge: (nodeId: string, source: "source" | "target") => IQuantaRFEdge | undefined,

    /**
     * Gets the potential parent id of the node 
     * @param nodeId 
     *  id of the node
     * @returns 
     */
    getParentId: (nodeId: string) => string | undefined,

    /**
     * this gets a socket from a node within the editor
     * @param nodeId
     *  id of the node the socket is a part of 
     * @param socketId 
     *  id of the socket
     * @param type 
     *  whether the socket is an input or output
     */
    getNodeSocket: (nodeId: string, socketId: string, type: "input" | "output") => IQuantaSocket | undefined,

    getNode: (nodeId: string) => IQuantaRFNode | undefined,

    setIterNodeType: (nodeId: string, nodeType: IQuantaTypeRef) => void,

    getIterNodeType: (nodeId: string) => IQuantaTypeRef | undefined,

    hasCache: () => void,
}

export * from './nodes'
export * from './store'
export * from './node-instructions'
export * from './form'
export * from './node-type'
export * from './edges'

export type { IQuantaEditorGlobals }