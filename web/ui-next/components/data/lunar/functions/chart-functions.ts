import { SetStateAction } from "react"
import { IIndicator } from "../../datasets/DatasetsTypes"
import { DEFAULT_CHART_GLOBALS, DEFAULT_SETTINGS, IIndicatorSetting, ILunarProjectData, IProjectNodeData } from "../types/types"
import { GetItem, SetItem } from "./util-functions"

function AddIndicator(
    data: ILunarProjectData | null,
    setData: (value: SetStateAction<ILunarProjectData | null>) => void,
    id: string,
    indicator: IIndicator,
    toggleDriveUpdate: () => void,
) {
    if(data === null)
        return
    let node = GetItem(id, data.splits)
    if(node === null)
        return
    if(node.node_type !== "chart")
        return

    if(node.data === undefined)
        node.data = { indicators: [] } as IProjectNodeData
    if(node.data.indicators === undefined)
        node.data.indicators = []
        
    //check if indicator is in the chart
    for(let i = 0; i < node.data.indicators.length; i++) {
        let indicator_ = node.data.indicators[i]
        if(CompareIndicators(indicator, indicator_))
            return
    }
    
    node.data.indicators.push(indicator)
    let nSplits = SetItem(node, data.splits)
    let nData   = data
    nData.splits = nSplits

    setData({ ...nData })
}

function DeleteIndicator(
    data: ILunarProjectData | null,
    setData: (value: SetStateAction<ILunarProjectData | null>) => void,
    id: string,
    indicator: IIndicator,
    toggleDriveUpdate: () => void,
) {
    if(data === null)
        return
    let node = GetItem(id, data.splits)
    if(node === null)
        return
    if(node.node_type !== "chart")
        return
    if(node.data === undefined || node.data.indicators === undefined)
        return
    let nIndicators = []
    for(let i = 0; i < node.data.indicators.length; i++) {
        let indicator_ = node.data.indicators[i]
        if(CompareIndicators(indicator, indicator_))
            continue
        
        nIndicators.push(indicator_)
    }

    node.data.indicators = nIndicators
    let nSplits = SetItem(node, data.splits)
    let nData = data
    nData.splits = nSplits

    setData({ ...nData })
    toggleDriveUpdate()
}

function CreateSettings(
    data: ILunarProjectData | null,
    setData: (value: SetStateAction<ILunarProjectData | null>) => void,
    id: string,
    toggleDriveUpdate: () => void,
) {
    if(data === null)
        return
    
    let node = GetItem(id, data.splits)
    if(node === null)
        return
    if(node.node_type !== "chart")
        return

    if(node.data === undefined)
        node.data = {}
    if(node.data.chartSettings === undefined)
        node.data.chartSettings = DEFAULT_SETTINGS

    let nSplits = SetItem(node, data.splits)
    let nData = data
    nData.splits = nSplits

    setData({ ...nData })
    toggleDriveUpdate()
}

function CreateGlobals(
    data: ILunarProjectData | null,
    setData: (value: SetStateAction<ILunarProjectData | null>) => void,
    id: string,
    toggleDriveUpdate: () => void,
) {
    if(data === null)
        return
    let node = GetItem(id, data.splits)
    if(node === null)
        return
    if(node.node_type !== "chart")
        return
    if(node.data === undefined)
        node.data = {}
    if(node.data.chartGlobals === undefined)
        node.data.chartGlobals = DEFAULT_CHART_GLOBALS

    let nSplits = SetItem(node, data.splits)
    let nData = data
    nData.splits = nSplits

    setData({ ...nData })
    toggleDriveUpdate()
}

function SetChartTitle(
    data: ILunarProjectData | null,
    setData: (value: SetStateAction<ILunarProjectData | null>) => void,
    id: string,
    name: string,
    toggleDriveUpdate: () => void,
) {
    if(data === null)
        return
    let node = GetItem(id, data.splits)
    if(node === null)
        return
    if(node.node_type !== "chart")
        return
    if(node.data === undefined || node.data.chartGlobals === undefined)
        return

    node.data.chartGlobals.chartTitle = name
    let nSplits = SetItem(node, data.splits)
    let nData = data
    nData.splits = nSplits

    setData({ ...nData })
    toggleDriveUpdate()
}

function CompareIndicators(indicatorA: IIndicator, indicatorB: IIndicator) {
    let datasetFlag = indicatorA.dataset === indicatorB.dataset
    let objectFlag = indicatorA.object.object_id === indicatorB.object.object_id
    let indicatorFlag = indicatorA.indicator.indicator_id === indicatorB.indicator.indicator_id

    return datasetFlag && objectFlag && indicatorFlag
}

function GetIndicatorSetting(
    data: ILunarProjectData | null,
    id: string,
    indicator: IIndicator
): IIndicatorSetting | null {
    if(data === null)
        return null
    
    let node = GetItem(id, data.splits)
    if(node === null)
        return null
    if(node.node_type !== "chart")
        return null
    if(node.data === undefined || node.data.chartSettings === undefined)
        return null

    let indicatorSettings = node.data.chartSettings.indicatorSettings
    let indicatorSetting = null
    for(let i = 0; i < indicatorSettings.length; i++) {
        let setting = indicatorSettings[i]
        let setting_indicator = setting.indicator

        if(CompareIndicators(indicator, setting_indicator))
            indicatorSetting = setting
    }

    return indicatorSetting
}

function CreateIndicatorSetting(
    data: ILunarProjectData | null,
    setData: (value: SetStateAction<ILunarProjectData | null>) => void,
    toggleDriveUpdate: () => void,
    id: string,
    setting: IIndicatorSetting
) {
    if(data === null)
        return

    let node = GetItem(id, data.splits)
    if(node === null)
        return
    if(node.node_type !== "chart")
        return
    if(node.data === undefined || node.data.chartSettings === undefined)
        return

    let indicatorSettings = node.data.chartSettings.indicatorSettings
    indicatorSettings.push(setting)
    node.data.chartSettings.indicatorSettings = indicatorSettings 

    let nSplits = SetItem(node, data.splits)
    let nData = data
    nData.splits = nSplits
    setData({ ...nData })
    toggleDriveUpdate()
}

export { 
    AddIndicator, 
    CreateSettings, 
    GetIndicatorSetting,
    CreateIndicatorSetting,
    DeleteIndicator,
    CreateGlobals,
    SetChartTitle,
    CompareIndicators 
}