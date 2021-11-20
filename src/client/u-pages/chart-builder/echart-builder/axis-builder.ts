import { AxisOptions } from './types'

class BuildAxis {
    options: AxisOptions

    constructor() {
        this.options = {} as AxisOptions
    }

    SetAxisType(type: "value" | "category") {
        this.options.type = type
    }

    SetAxisData(data: Array<string> | Array<number>) {
        if(typeof data[0] == 'string' && this.options.type == "category")
            this.options.data = data
        
    }
}

export default BuildAxis