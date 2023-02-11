import { Dispatch, SetStateAction } from "react";
import { DEFAULT_DOCUMENT } from "../../../lunar/document-editor/document-editor";
import { IDocument } from "../types/document-types";
import { ILunarProjectData, IProjectDocument } from "../types/types";

/**
 * @param {ILunarProjectData} data
 *  This is the project's current data structure
 * @param {Dispatch<SetStateAction<ILunarProjectData | null>>} setData
 *  This is the function that allows the function to update the data structure
 * @param {() => void} updateDrive
 *  function to update the server if it was created
 * @param {string} documentId
 *  this is the id of the document that needs to be fetched
 * @description
 *  this grabs the document from the projects documetn data list.
 *  if there is no document, it creates one based on the id given.
 * @returns IProjectDocument
 */
function GrabDocument(
    data: ILunarProjectData | null,
    setData: Dispatch<SetStateAction<ILunarProjectData | null>>,
    updateDrive: () => void,
    documentId: string,
) : IProjectDocument | null {
    if(data === null)
        return null
    
    let documents = data.documents
    if(documents === undefined)
        documents = [] as IProjectDocument[]

    let document: IProjectDocument | null = null
    for(let i = 0; i < documents.length; i++) {
        let document_ = documents[i]
        if(document_.document_id === documentId)
            document = document_
    }

    if(document === null) {
        document = {} as IProjectDocument
        document.document_id = documentId
        document.data = {} as IDocument
        document.data.pages = []
        document.data.pages.push({
            blocks: []
        })

        documents.push(document)
        data.documents = documents
        setData({ ...data })
        updateDrive()
    }

    return document
}

/**
 * @description
 *  this function sets the data of a document
 *  in the project.
 * @param data 
 *  this is the current data in the project
 * @param setData 
 *  this sets the project data
 * @param updateDrive 
 *  this updates the servers version of the project
 * @param documentId 
 *  this is the id of the document being referenced
 * @param documentData 
 *  this is the new data being set
 * @returns void
 */
function SetDocument(
    data: ILunarProjectData | null,
    setData: Dispatch<SetStateAction<ILunarProjectData | null>>,
    updateDrive: () => void,
    documentId: string,
    documentData: IDocument
) {
    if(data === null)
        return

    let documents = data.documents
    if(documents === undefined)
        documents = []

    for(let i = 0; i < documents.length; i++) {
        let document = documents[i]
        if(document === undefined)
            continue
        if(document.document_id === documentId)
            document.data = documentData

        documents[i] = document
    }

    let nData = data
    nData.documents = documents
    setData({ ...nData })
    updateDrive()
}

export { 
    GrabDocument,
    SetDocument 
}