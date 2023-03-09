import { ICallStackFunc } from "../types";

function sdmxDataParserExecute(this: any, stack: ICallStackFunc) {
    if(this === undefined)
        return

    this.logMsg("Executing SDMX Data Parser")

    let inputs = stack.inputs
    let funcInputs = {} as any
    for(let i = 0; i < inputs.length; i++) {
        let input = inputs[i]
        if(input.staticSocket === true && input.type.typeId !== undefined) {
            funcInputs[input.id] = input.type.typeId
            continue
        }

        funcInputs[input.id] = this.getInputValue(stack.nodeId, input.id)
    }

    let that = this
    let promise = new Promise(function(resolve, reject) {
        let dataFormat = funcInputs.format
        let requiredValues = ["version", "format"]
        if(dataFormat === "sdmx_xml")
            requiredValues = [ ...requiredValues, "data_file", "schema_file" ]

        function abort(msg: string) {
            reject(`sdmx_data_parser ${msg}`)
        }

        //validate the functions
        for(let i = 0; i < requiredValues.length; i++) {
            let requiredValue = requiredValues[i]
            let val = funcInputs[requiredValue]
            if(val === undefined)
                abort("bad_inputs")
        }

        
    })

    return promise
}

export default sdmxDataParserExecute