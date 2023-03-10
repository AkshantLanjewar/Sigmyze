import { ICallStackFunc } from "../types";

async function sdmxDataParserExecute(this: any, stack: ICallStackFunc) {
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
    }

    
}

export default sdmxDataParserExecute