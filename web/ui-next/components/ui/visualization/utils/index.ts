import { IChartData } from '../../../quanta/quanta-indicator-manager/types';
import { validateChartData } from '../../../quanta/quanta-indicator-manager/utils';
import { IANTParsedChartData } from './types'

function getMonthShortName(monthNo: number) {
    const date = new Date();
    date.setMonth(monthNo - 1);
  
    return date.toLocaleString('en-US', { month: 'short' });
  }

function convertQuantaChartDataAnt(data: IChartData[]) {
    let convertedData = [] as IANTParsedChartData[]
    if(validateChartData(data) === false)
        return convertedData

    for(let i = 0; i < data.length; i++) {
        let point = data[i]
        let timestamp = point.xValue! * 1000
        let date = new Date(timestamp)
        
        let dateString = `${getMonthShortName(date.getMonth())} ${date.getFullYear()}`
        convertedData.push({ date: dateString, value: point.xValue! })
    }

    return convertedData
}

export * from './types'
export { convertQuantaChartDataAnt }