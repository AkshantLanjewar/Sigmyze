import { MantineColor } from "@mantine/core"
import { IUIDropdownItem } from "../../../ui/ui-dropdown/types"

type QuantaFormType = "text" | "dropdown" | "additional" | "file" | "alert" | "segment"

/**
 * Form field definitions
 */
interface IQuantaFormField {
    /**
     * input type
     */
    type?: QuantaFormType,

    /**
     * input name
     */
    name?: string,

    /**
     * Icon for the input
     */
    icon?: JSX.Element,

    /**
     * key in the dynamic object where value is stored
     */
    linkedKey?: string // links to a key within the data element in the store item,

    /**
     * this is the related dropdown field in the quanta_types file
     */
    dropdownField?: string,

    /**
     * if we want to manually add dropdown items that are not present within the quanta_types
     */
    manualDropdownItems?: IUIDropdownItem[],

    /**
     * additional fields that need to be added to the dynamic object
     */
    additionalFields?: IQuantaAdditionalField[],

    /**
     * id for the field
     */
    id?: string,

    /**
     * this is the type for the file
     */
    fileType?: string,

    /**
     * this is the name for the file we want uploaded
     */
    fileName?: string,

    /**
     * the icon for the alert section
     */
    alertIcon?: JSX.Element,

    /**
     * the title for the alert section
     */
    alertTitle?: string,

    /**
     * the content for the alert section
     */
    alertContent?: string,

    /**
     * the color of the alert
     */
    alertColor?: MantineColor,

    /**
     * items that are rendered within a segment output
     */
    segmentItems?: ISegmentItem[]
}

interface ISegmentItem {
    /**
     * the value that will be put into the output dict
     */
    value: string,

    /**
     * the name of the segment item
     */
    name: string,

    /**
     * the icon for the segment item
     */
    icon: JSX.Element
}

/**
 * This is the additional field values
 */
interface IQuantaAdditionalField {
    /**
     * Key for the field
     */
    key: string,

    /**
     * value for the field
     */
    value: any
}

export type {
    IQuantaFormField,
    IQuantaAdditionalField,
    QuantaFormType,
    ISegmentItem
}