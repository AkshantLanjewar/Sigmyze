import { MantineColor } from "@mantine/core"
import { IUIDropdownItem } from "../../../ui/ui-dropdown/types"

type QuantaFormType = "text" | "dropdown" | "additional" | "file" | "alert" | "segment" | "dynamic"

/**
 * Form field definitions
 */
interface IQuantaFormField {
    /**
     * input type
     */
    type?: QuantaFormType,

    /**
     * this is the testing id inserted into the elements container
     */
    testId?: string,

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
     * must set the segment value in the default value object
     */
    segmentItems?: ISegmentItem[],

    /**
     * this is the config for the dynamic form element
     */
    dynamicConfig?: IDynamicConfig
}

interface IDynamicConfig {
    /**
     * this is the id of the form element we are trying to dynamically monitor
     */
    dependsOn: string,

    /**
     * this is the required value we want from that form element in order to trigger the property
     */
    dependValue: any,

    /**
     * this is the action we are taking for the dynamic property
     * visibility: means that the content will be hidden unless the value is triggered
     */
    dynamicProperty: "visibility",

    /**
     * this is the actual form element we want to dynamically control
     */
    dynamicContent: IQuantaFormField
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
    ISegmentItem,
    IDynamicConfig
}