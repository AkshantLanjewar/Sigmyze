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
    BuildField
} from "./nodes"

const prebuildNodeDict = {
    start: StartNode,
    iter: IterNode,
    sdmx_data_parser: SDMXDataParser,
    sdmx_data_mapper: SDMXDataMapper,
    file_upload: FileUpload,
    apply_data_rule: ApplyDataRule,
    get_sdmx_field_key: GetSDMXFieldKey,
    get_sdmx_field_value: GetSDMXFieldValue,
    build_fields: BuildField
} as { [key: string]: IQuantaNodeInstructions }

export default prebuildNodeDict