import { IQuantaSchema } from "../../../schema-editor/types"
import { IQuantaRFEdge } from "../../types/edges"
import { ICallStackFunc } from "../types"

interface IInternalStore {
    nodeId: string,
    socketId: string
}

interface IInternalStorePreload {
    store: IInternalStore,
    value: string
}

interface IExecuteStackBody {
    preloadedData: string,
    stack: ICallStackFunc[],
    edges: IQuantaRFEdge[],
    organizationId: string,
    schema?: IQuantaSchema
}

export type { 
    IInternalStore, 
    IInternalStorePreload,
    IExecuteStackBody 
}