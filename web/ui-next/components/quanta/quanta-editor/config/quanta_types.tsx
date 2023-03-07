import { IQuantaTypeGroup } from "../types/types"
import { BaseTypes, ChartRules, FileTypes, SchemaTypes, SDMXFileTypes, SDMXVersionTypes } from "./quanta-types"

const typeGroups = [
    BaseTypes,
    FileTypes,
    SDMXVersionTypes,
    SDMXFileTypes,
    ChartRules,
    SchemaTypes
] as IQuantaTypeGroup[]

export default typeGroups