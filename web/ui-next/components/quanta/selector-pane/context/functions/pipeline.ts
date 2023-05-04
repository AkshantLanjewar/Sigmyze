import { v4 } from "uuid"
import { ISelectorPipelineOptions } from "../../selector-pipeline"
import { IPipelinedData } from "../types"
import { Dispatch, SetStateAction } from "react"

const addPipelineObject = (
    object: ISelectorPipelineOptions,
    pipelinedObjects: IPipelinedData[],
    setPipelinedObject: Dispatch<SetStateAction<IPipelinedData[]>>,
    toggleAnalyzePipeline: () => void
) => {
    let newPipelinedObject = {} as IPipelinedData
    if(object.displayType === "dataset" && object.linkedItemId === undefined)
        return

    newPipelinedObject.pipeline_id = v4()
    newPipelinedObject.pipeline_name = object.optionName
    newPipelinedObject.pipeline_type = object.displayType
    newPipelinedObject.dataset_id = object.linkedItemId
    if(object.displayType !== "selected")
        newPipelinedObject.reservable = true

    let nPipelined = pipelinedObjects
    nPipelined.push(newPipelinedObject)
    setPipelinedObject([ ...nPipelined ])
    toggleAnalyzePipeline()
}

const removePipelineObject = (
    objectId: string,
    pipelinedObjects: IPipelinedData[],
    setPipelinedObject: Dispatch<SetStateAction<IPipelinedData[]>>,
    toggleAnalyzePipeline: () => void
) => {
    let nPipelinedObjects = [] as IPipelinedData[]
    for(let i = 0; i < pipelinedObjects.length; i++) {
        let pipelinedObject = pipelinedObjects[i]
        if(pipelinedObject.pipeline_id === objectId)
            continue

        nPipelinedObjects.push(pipelinedObject)
    }

    setPipelinedObject([ ...nPipelinedObjects ])
    toggleAnalyzePipeline()
}

export { addPipelineObject, removePipelineObject }