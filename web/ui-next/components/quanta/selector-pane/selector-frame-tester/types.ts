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

export type { 
    IIFrameMessage,
    IPingFrameData,
    ISetSchemaMessage,
    ISchemaItem 
}