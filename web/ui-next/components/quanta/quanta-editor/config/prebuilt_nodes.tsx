import { IQuantaNodeInstructions } from "../types/types"
import { 
    ApplyDataRule, 
    IterNode, 
    SDMXDataMapper, 
    SDMXDataParser, 
    StartNode, 
    FileUpload 
} from "./nodes"

const prebuildNodeDict = {
    start: StartNode,
    iter: IterNode,
    sdmx_data_parser: SDMXDataParser,
    sdmx_data_mapper: SDMXDataMapper,
    file_upload: FileUpload,
    apply_data_rule: ApplyDataRule
} as { [key: string]: IQuantaNodeInstructions }

export default prebuildNodeDict