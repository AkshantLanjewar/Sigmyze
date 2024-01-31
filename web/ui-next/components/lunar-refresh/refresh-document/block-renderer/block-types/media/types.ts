import { IQuantaIndicatorLoc } from "../../../../data-manager/state"

interface IChartLoc {
    /**
     * this is the id for the chart's file
     */
    fileId: string

    /**
     * This is the title assigned to the chart
     */
    title: string
}

interface ISerializedNoteChart {
    /**
     * This is the file ID of the chart we are trying to link to the document
     */
    fileId: string,

    /**
     * These are the indicators for the chart
     */
    indicators: IQuantaIndicatorLoc[]

    /**
     * This field is to check whether or not the data has been marshaled properly from the block content
     */
    marshalCheck?: string

    /**
     * This is the rendered title for the chart, can be changed in the add chart modal
     */
    title: string,

    /**
     * Whether or not to hide the yAxis
     */
    hideYAxis: boolean,

    /**
     * Whether or not to hide the xAxis
     */
    hideXAxis: boolean,

    /**
     * Whether or not to hide the legend
     */
    hideLegend: boolean,

    /**
     * Whether or not to invert the yAxis position (default on left side)
     */
    invertYAxis: boolean,

    /**
     * Whether or not to display the title
     */
    showTitle: boolean

}

interface ISerializedNoteImage {
    /**
     * This is the width of the image
     */
    width: number,

    /**
     * This is the height of the image
     */
    height: number,

    /**
     * This is the data of the image stored in base64 format
     */
    data: string,

    /**
     * This field is to check whether or not the data has been marshaled properly from the block content
     */
    marshalCheck?: string
}

export type { 
    ISerializedNoteChart, 
    IChartLoc,
    ISerializedNoteImage 
}