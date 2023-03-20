import { IQuantaTypeRef } from "../types/node-type"

interface ICallStackParam {
    id: string,
    type: IQuantaTypeRef,
    name: string,
    staticSocket?: boolean
}

interface ICallStackFunc {
    nodeId: string,
    functionId: string,
    inputs: ICallStackParam[],
    dynamicOutputs: ICallStackParam[],
    dependencies: string[],

    parentId?: string,
    stackThread?: ICallStackFunc[]
}

interface ICallStackStore {
    [key: string]: any
}

interface IInputValueResp {
    value: any
}

interface IFunctionResp {
    success: boolean
}

export type { 
    ICallStackParam,
    ICallStackFunc,
    ICallStackStore,
    IInputValueResp,
    IFunctionResp
}