import { IconRadar } from "@tabler/icons"
import { IQuantaIndicatorLoc } from "../../../lunar-refresh/data-manager/state"
import { ISigmyzeFile, ISigmyzeFileChild, ISigmyzeFilesystem, ISigmyzeFolder } from "../types"
import { IQuantaIndicatorText } from "../../quanta-dataset-manager/types"

const setChartIndicatorFILE = async (
    file: ISigmyzeFile, 
    indicators: IQuantaIndicatorLoc[],
    fetchIndicatorText: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicatorText | undefined>
) => {
    //now we need to create the children that the file will have
    let children: ISigmyzeFileChild[] = []
    for(let i = 0; i < indicators.length; i++) {
        let indicator = indicators[i]
        let indicatorText = await fetchIndicatorText(indicator.datasetId, indicator.indicatorId)
        if(indicatorText === undefined)
            continue

        children.push({
            icon: "radar",
            text: indicatorText.short,
            indicator
        })
    }

    file.children = children
    return file
}

const setChartIndicatorFOLDER = async (
    folder: ISigmyzeFolder,
    fileId: string,
    indicators: IQuantaIndicatorLoc[],
    fetchIndicatorText: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicatorText | undefined>
) => {
    //lets go through the root files to see if its there
    for(let i = 0; i < folder.files.length; i++) {
        let file = folder.files[i]
        if(file.fileId === fileId)
            folder.files[i] = await setChartIndicatorFILE(file, indicators, fetchIndicatorText)
    }

    //now to recursively go through the folders
    for(let i = 0; i < folder.folders.length; i++) {
        let _folder = folder.folders[i]
        folder.folders[i] = await setChartIndicatorFOLDER(_folder, fileId, indicators, fetchIndicatorText)
    }

    return folder
}

const setChartIndicators = async (
    loadedFilesystem: ISigmyzeFilesystem,
    fileId: string,
    indicators: IQuantaIndicatorLoc[],
    fetchIndicatorText: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicatorText | undefined>
) => {
    let returnFilesystem = loadedFilesystem
    //first we need to go through the root files to see if it is there
    for(let i = 0; i < returnFilesystem.files.length; i++) {
        let file = returnFilesystem.files[i]
        if(file.fileId === fileId)
            returnFilesystem.files[i] = await setChartIndicatorFILE(file, indicators, fetchIndicatorText)
    }

    //now we need to recursively go through the folders
    for(let i = 0; i < returnFilesystem.folders.length; i++) {
        let folder = returnFilesystem.folders[i]
        returnFilesystem.folders[i] = await setChartIndicatorFOLDER(folder, fileId, indicators, fetchIndicatorText)
    }

    return returnFilesystem
}

export { setChartIndicators }