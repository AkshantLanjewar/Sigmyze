import { useEffect, useState } from "react"
import { IQuantaFormField } from "../../quanta/quanta-editor/types/types"
import TextInputQuanta from "./form-elements/text-input"
import { convertTypesToDropdown } from "../../quanta/quanta-editor/utils"
import DropdownInput from "./form-elements/dropdown-input"
import { Alert } from "@mantine/core"
import QuantaSegmentControl from "./form-elements/segment-control"
import FileInput from "./form-elements/file-input/file-input"
import DynamicElement from "./form-elements/dynamic-element"

interface IFormElementProps {
    step: IQuantaFormField,
    valStore: { [key: string]: any; },
    getValue(id: string): any,
    setValue(id: string, val: any): void,
}

const FormElement: React.FC<IFormElementProps> = ({ step, getValue, setValue, valStore }) => {
    const [displayFragment, setDisplayFragment] = useState<JSX.Element | null>(null)

    useEffect(() => {
        let inputType = step.type
        let output: JSX.Element | null = null
        setDisplayFragment(null)

        switch(inputType) {
            case "text":
                output = (
                    <TextInputQuanta 
                        name={step.name}
                        icon={step.icon}
                        value={getValue(step.id!)}
                        testingId={step.testId}
                        setValue={(id: string) => setValue(step.id!, id)}
                    />
                )

                break
            case "dropdown":
                let dropdownItems = undefined
                if(step.dropdownField !== undefined)
                    dropdownItems = convertTypesToDropdown(step.dropdownField)
                else if(step.manualDropdownItems !== undefined)
                    dropdownItems = step.manualDropdownItems

                if(dropdownItems === undefined)
                    return
                
                output = (
                    <DropdownInput
                        items={dropdownItems}
                        name={step.name}
                        value={getValue(step.id!)}
                        testId={step.testId}
                        setValue={(value: string) => setValue(step.id!, value)}
                    />
                )
                break
            case "alert":
                let alertIcon = step.alertIcon
                let alertTitle = step.alertTitle
                let alertContent = step.alertContent
                let alertColor = step.alertColor
                
                let alertTestId = ""
                if(alertIcon === undefined || alertTitle === undefined || alertContent === undefined || alertColor === undefined)
                    return
                if(step.testId !== undefined)
                    alertTestId = step.testId
                
                output = (
                    <div data-testId={alertTestId}>
                        <Alert
                            icon={alertIcon}
                            color={alertColor}
                            title={alertTitle}
                        >
                            {alertContent}
                        </Alert>
                    </div>
                )
                break
            case "file":
                let fileType = step.fileType
                let fileName = step.fileName
                if(fileName === undefined && step.name !== undefined)
                    fileName = step.name

                if(fileType === undefined || fileName === undefined)
                    return

                output = (
                    <FileInput 
                        fileType={fileType}
                        fileName={fileName}
                        testId={step.testId}
                        setValue={(val: any) => setValue(step.id!, val)}
                    /> 
                )
                break
            case "segment":
                let segmentItems = step.segmentItems
                if(segmentItems === undefined)
                    return
                
                output = (
                    <QuantaSegmentControl
                        value={getValue(step.id!)}
                        testId={step.testId}
                        setValue={(id: string) => setValue(step.id!, id)}
                        segmentItems={segmentItems}
                    />
                )
                break
            case "dynamic":
                let dynamicConfig = step.dynamicConfig
                if(dynamicConfig === undefined)
                    return
                
                output = (
                    <DynamicElement
                        dynamicConfig={dynamicConfig}
                        valStore={valStore}
                        getValue={getValue}
                        setValue={setValue}
                    />
                )
                break
            default:
                output = null
                break
        }

        setDisplayFragment(output)
    }, [step, setValue])

    return displayFragment
}

export default FormElement