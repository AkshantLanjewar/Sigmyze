interface IIFrameMessage {
    function?: string,
    data?: string
}

interface IPingFrameData {
    sourceId?: string
}

interface ISetSchemaMessage {
    schemaName?: string,
    schemaItems?: ISchemaItem[]
}

interface ISchemaItem {
    name: string,
    type: "string" | "date"
}

interface ISelectedMessage {
    id: string,
    data: any
}

export type { 
    IIFrameMessage,
    IPingFrameData,
    ISetSchemaMessage,
    ISchemaItem,
    ISelectedMessage 
}