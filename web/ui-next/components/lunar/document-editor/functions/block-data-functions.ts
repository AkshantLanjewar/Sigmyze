import { SetStateAction } from "react";
import { v4 } from "uuid";
import { IDocument, IDocumentData } from "../../../data/lunar/types/document-types";

function LoadImage(
    imageData: string,
    internalData: IDocument,
    setInternalData: (value: SetStateAction<IDocument>) => void,
) {
    let nData = internalData
    let documentData = nData.data
    if(documentData === undefined)
        documentData = {} as IDocumentData

    let imageStore = documentData.image_store
    if(imageStore === undefined)
        imageStore = {}

    let imageId = null
    for(let i = 0; i < Object.keys(imageStore).length; i++) {
        let key = Object.keys(imageStore)[i]
        let val = imageStore[key]

        if(val === imageData)
            imageId = key
    }

    if(imageId === null) {
        imageId = v4()
        imageStore[imageId] = imageData
        documentData.image_store = imageStore
        nData.data = documentData

        setInternalData({ ...nData })
    }

    return imageId
}

function GetImage(id: string, internalData: IDocument) {
    let documentData = internalData.data
    if(documentData === undefined)
        return null

    let imageStore = documentData.image_store
    if(imageStore === undefined)
        return null

    let imageValue = imageStore[id]
    if(imageValue === undefined)
        return null
    return imageValue
}

export { 
    LoadImage,
    GetImage 
}