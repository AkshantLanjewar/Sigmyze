import { IQuantaTypeGroup } from "../types/types"
import { BaseTypes, ChartRules, FileTypes, SchemaTypes, SDMXFileTypes, SDMXVersionTypes } from "./quanta-types"
import { QuantaTypes } from "./quanta-types/quanta-type"

const typeGroups = [
    BaseTypes,
    FileTypes,
    SDMXVersionTypes,
    SDMXFileTypes,
    ChartRules,
    SchemaTypes,
    QuantaTypes
] as IQuantaTypeGroup[]

export default typeGroups