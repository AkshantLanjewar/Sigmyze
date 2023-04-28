import { Dispatch, SetStateAction } from "react"
import { IQuantaSelectorCode } from "../../../data/quanta/types/project"
import { ISelectorPipelineOptions } from "../selector-pipeline"
import { IQuantaTypeRef } from "../../quanta-editor/types/node-type"

interface ISelectorPaneState {
    initialized: boolean,

    selectorCode: IQuantaSelectorCode | null,

    pipelinedObjects: IPipelinedData[],

    analyzePipeline: boolean,

    analyzePipelineLoading: boolean,

    pipelineAnalysis: IPipelineAnalysis[],

    //funcs
    compileProject: (projectData: string) => Promise<any>,

    setTestSource: (source: string | null) => void,

    setSelectorCode: Dispatch<SetStateAction<IQuantaSelectorCode | null>>,

    setSelectorLink: (datasetId: string, selectorId: string) => void,

    addPipelineObject: (object: ISelectorPipelineOptions) => void,

    deletePipelineObject: (objectId: string) => void,

    clearAnalysis: () => void,

    toggleAnalyzePipeline: () => void,

    setAnalyzePipeline: (val: boolean) => void,

    setPipelineLoading: (val: boolean) => void
}

interface IPipelinedData {
    /**
     * static id for the pipeline
     */
    pipeline_id: string,

    /**
     * This is the type of the data that is being pipelined into our selector
     * 
     * DATASET: this is data pipelined from the collected dataset
     * SELECTED: This is the object with values selected from previous selectors
     */
    pipeline_type: 'dataset' | 'selected',

    /**
     * this is the name of the object being pipelined into the selector
     */
    pipeline_name: string,

    /**
     * this is the id of the object within the dataset object
     */
    dataset_id?: string,
}

interface IPipelineAnalysis {
    /**
     * the id of the object being statically analyzed
     */
    objectId: string,

    /**
     * the type of the object
     * only can be string or date
     */
    objectType?: "string" | "date",

    /**
     * whether or not the analyzed field returns an array or not
     */
    isArray?: boolean,

    /**
     * value if type is string and is not array
     */
    stringValue?: string,

    /**
     * value if type is string and is array
     */
    stringArray?: string,

    /**
     * value if type is date and is not array
     */
    dateValue?: number,

    /**
     * value if type is date and is array
     */
    dateArray?: number[]
}

export type { 
    ISelectorPaneState,
    IPipelinedData,
    IPipelineAnalysis 
}