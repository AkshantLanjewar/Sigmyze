import { IQuantaNodeInstructions } from "../types/types"
import { 
    ApplyDataRule, 
    IterNode, 
    SDMXDataMapper, 
    SDMXDataParser, 
    StartNode, 
    FileUpload, 
    GetSDMXFieldKey,
    GetSDMXFieldValue,
    BuildField,
    StringToDate,
    AddIndicator
} from "./nodes"

const prebuildNodeDict = {
    start: StartNode, // created callstack
    iter: IterNode, // created clalstack
    sdmx_data_parser: SDMXDataParser, // created callstack
    sdmx_data_mapper: SDMXDataMapper, // created callstack
    file_upload: FileUpload, // created callstack
    apply_data_rule: ApplyDataRule, //created callstack
    get_sdmx_field_key: GetSDMXFieldKey, // created callstack
    get_sdmx_field_value: GetSDMXFieldValue, // created callstack
    build_fields: BuildField, // created callstack
    string_to_date: StringToDate, // created callstack
    add_indicator: AddIndicator
} as { [key: string]: IQuantaNodeInstructions }

export default prebuildNodeDict