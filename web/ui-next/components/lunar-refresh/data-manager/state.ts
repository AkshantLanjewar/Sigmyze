import { Dispatch, SetStateAction } from "react"
import { ISimpleFilesystem } from "../../ui/file-management/types"
import { INoteBlock } from "../refresh-document/types"

/**
 * This is the dataset description for the fields shared in the Data Manager context
 */
interface ILunarDataManagerState {
    /**
     * theese are charts that have been created within the current loaded project
     */
    charts: ILunarChart[],

    /**
     * theese are notes that have been created within the current loaded project
     */
    notes: ILunarNote[],

    /**
     * This is the indicator actively being used during an event
     */
    eventIndicator: IQuantaIndicatorLoc | undefined,

    /**
     * this is the function that adds an indicator to a chart
     */
    addChartIndicator: (fileId: string, indicator: IQuantaIndicatorLoc) => void,

    /**
     * This is the function that adds indicator children to a file in the view component
     */
    updateSigmyzeIndicators: (fileId: string) => void,

    /**
     * This is the function that gets all the indicators for a specific chart
     */
    getChartIndicators: (fileId: string) => IQuantaIndicatorLoc[],

    /**
     * this is the function that removes an indicator from the chart
     */
    deleteChartIndicator: (fileId: string, indicator: IQuantaIndicatorLoc) => void,

    /**
     * Function that sets the event indicator
     */
    setEventIndicator: Dispatch<SetStateAction<IQuantaIndicatorLoc | undefined>>,

    /**
     * Function that fetches the blocks from a note
     */
    fetchNoteBlocks: (fileId: string) => INoteBlock[] | undefined,

    /**
     * function that updates the blocks in a note
     */
    updateNoteBlocks: (fileId: string, blocks: INoteBlock[]) => void
}

/**
 * This is the definition for a Lunar Project
 */
interface ILunarProject {
    /**
     * NOTE: This is mainly a backend field
     * this is the projectID, uniquely generated, in a way similar to the v4() from uuid
     */
    projectId: string,

    /**
     * This is the name of the project
     */
    name: string,

    /**
     * theese are the notes that were created in the lunar project
     */
    notes: ILunarNote[],

    /**
     * theese are the charts that were created in the lunar project
     */
    charts: ILunarChart[],

    /**
     * this is the simplefilesystem representation of the filesystem in the project
     */
    fileSystem: ISimpleFilesystem   
}

/**
 * This is the definition for a quanta indicator that will be used
 */
interface IQuantaIndicatorLoc {
    /**
     * This is the ID for the dataset
     */
    datasetId: string,

    /**
     * This is the ID for the indicator that we are requesting
     */
    indicatorId: string
}

/**
 * this is the data definition for a lunar chart item
 */
interface ILunarChart {
    /**
     * this is the name for the chart
     */
    name: string,

    /**
     * this is the file id for the chart, same concept as using v4() from uuid
     */
    objectId: string,

    /**
     * These are the indicators that are supposed to be rendered within the chart
     */
    indicators: IQuantaIndicatorLoc[]
}

/**
 * this is the data definition for a lunar note item
 */
interface ILunarNote {
    /**
     * this is the name for the note
     */
    name: string,

    /**
     * this is the file id for the note, same concept as using v4() from uuid
     */
    objectId: string,

    /**
     * These are the blocks that are stored within the note
     */
    blocks: INoteBlock[]
}

export type { 
    ILunarDataManagerState,
    IQuantaIndicatorLoc,
    ILunarProject,
    ILunarChart,
    ILunarNote 
}