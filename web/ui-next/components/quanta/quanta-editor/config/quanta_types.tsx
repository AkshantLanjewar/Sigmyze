import { IQuantaTypeGroup } from "../types/types"
import { BaseTypes, ChartRules, FileTypes, SDMXFileTypes, SDMXVersionTypes } from "./quanta-types"

const typeGroups = [
    BaseTypes,
    FileTypes,
    SDMXVersionTypes,
    SDMXFileTypes,
    ChartRules
] as IQuantaTypeGroup[]

export default typeGroups