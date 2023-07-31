import { IQuantaRFEdge } from "../../types/types";
import { ICallStackFunc, ICallStackParam, IFunctionResp } from "../types";
import { IInternalStore } from "./types";

interface ISDMXFunctionData {
    xml_data: IInternalStore,
    xsd_data: IInternalStore
}

async function sdmxDataParserNode(
    stack: ICallStackFunc,
    isFailedNode: (nodeId: string) => boolean,
    getInputEdge: (nodeId: string, socketId: string) => IQuantaRFEdge | undefined,
    executeFunction: (nodeId: string, functionId: string, outputIds: string[], functionData: any) => Promise<string>
) {
    let inputs = stack.inputs
    let search_inputs = [] as string[]
    let sdmx_file_type = "xml"

    let dynamic_inputs = [] as ICallStackParam[]
    for(let i = 0; i < inputs.length; i++) {
        let input = inputs[i]
        let input_id = input.id

        if(input_id === "format") {
            let input_type = input.type.typeId
            if(input_type === "sdmx_xml") {
                search_inputs = ["data_file", "schema_file"]
                sdmx_file_type = "xml"
            }
        }

        if(search_inputs.includes(input_id))
            dynamic_inputs.push(input)
    }

    //handle the sdmx types
    if(sdmx_file_type === "xml") {
        let data_file_id = undefined as string | undefined
        let schema_file_id = undefined as string | undefined

        for(let i = 0; i < dynamic_inputs.length; i++) {
            let dynamic_input = dynamic_inputs[i]

            if(dynamic_input.id === "data_file")
                data_file_id = dynamic_input.id
            if(dynamic_input.id === "schema_file")
                schema_file_id = dynamic_input.id
        }

        if(data_file_id === undefined || schema_file_id === undefined)
            throw new Error("malformed data")

        let data_edge = getInputEdge(stack.nodeId, data_file_id)
        let schema_edge = getInputEdge(stack.nodeId, schema_file_id)

        if(data_edge === undefined || schema_edge === undefined)
            throw new Error("inputs not connected")    
        if(isFailedNode(data_edge.source!) || isFailedNode(schema_edge.source!))
            throw new Error("input nodes failed")

        const function_id = "sdmx_data_parser"
        const output_ids = ["sdmx_indicators"]
        const function_data: ISDMXFunctionData = {
            xml_data: { 
                nodeId: data_edge.source!,
                socketId: data_edge.sourceHandle!
            },
            xsd_data: {
                nodeId: schema_edge.source!,
                socketId: schema_edge.sourceHandle!
            }
        }

        let funcRes = await executeFunction(stack.nodeId, function_id, output_ids, function_data)
        if(funcRes !== "Parsed SDMX Data")
            throw new Error("sdmx parsing error")
    }
}

export default sdmxDataParserNode