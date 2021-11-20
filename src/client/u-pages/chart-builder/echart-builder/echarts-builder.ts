import * as uuid from "uuid"
import { CHART_OPTIONS, title } from './types'

class SChartBuilder {
    options: CHART_OPTIONS
    uID: string

    constructor() {
        this.options = { xAxis: [] }
        this.uID = uuid.v4()
    }

    SetTitle(text: string): void {
        let titleOptions: title = {
            id: this.uID + "-title",
            show: true,
            text: text,

            fontFamily: "Roboto",
            fontSize: 18
        }

        this.options.titleOptions = titleOptions
    }

    HideTitle(): void {
        if(this.options.titleOptions != undefined)
            this.options.titleOptions.show = false
    }

    SetTitleFont(fontsize: number) {
        if(this.options.titleOptions != undefined)
            this.options.titleOptions.fontSize = fontsize
    }
}

export default SChartBuilder