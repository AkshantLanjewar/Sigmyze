import { IconFileCode2, IconSignature } from "@tabler/icons"
import { v4 } from "uuid"
import { IQuantaFormField } from "../../quanta/quanta-editor/types/form"

const PREBUILT_FORMS = {
    createFile: [
        {
            type: "text",
            name: "File Name",
            icon: <IconSignature />,
            linkedKey: "name",
            id: v4()
        },
        {
            type: "dropdown",
            dropdownField: "files",
            name: "File Type",
            linkedKey: "type",
            id: v4()
        },
        {
            type: "additional",
            additionalFields: [
                {
                    key: "icon",
                    value: <IconFileCode2 />
                }
            ]
        }
    ]
} as { [key: string]: IQuantaFormField[] }

export default PREBUILT_FORMS