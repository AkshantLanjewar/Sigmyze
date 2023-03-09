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
    dependencies: string[]
}

interface ICallStackStore {
    [key: string]: any
}

export type { 
    ICallStackParam,
    ICallStackFunc,
    ICallStackStore
}