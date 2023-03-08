import { ICallStackFunc } from "../types";

function fileUploadExecute(this: any, stack: ICallStackFunc ) {
    this.logMsg("Executing File Upload Node")

    function abort(this: any, errorMsg: string) {
        this.logMsg("Aborting File Upload")
        throw errorMsg
    }

    let inputs = stack.inputs
    let executution_input = undefined
    for(let i = 0; i < inputs.length; i++) {
        let input = inputs[i]
        switch(input.id) {
            case "execute_input":
                executution_input = this.getInputValue(stack.nodeId, input.id)
                break
            default:
                break
        }
    }

    try {
        if(executution_input !== true)
            abort.call(this, "missing inputs")

        //find the files we want uploaded
        let dynamicOutputs = stack.dynamicOutputs
        let files = []
        
        for(let i = 0; i < dynamicOutputs.length; i++) {

        }

    } catch(e) {
        this.logMsg(`ERROR -> ${e}`)
    }
}

export default fileUploadExecute