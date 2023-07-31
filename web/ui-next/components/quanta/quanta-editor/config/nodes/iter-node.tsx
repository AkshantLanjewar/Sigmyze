import { IconRepeat } from "@tabler/icons";
import { IQuantaNodeInstructions } from "../../types/types";

const IterNode = {
    name: "Iterate",
    icon: <IconRepeat />,
    description: "This node iterates over an array",
    immutableNode: true,

    inputs: [],
    outputs: []
} as IQuantaNodeInstructions

export { IterNode }