import { Button, Group, Stack } from "@mantine/core"
import { useEffect, useState } from "react"
import { IQuantaFormField } from "../../quanta/quanta-editor/types/types"
import { convertTypesToDropdown } from "../../quanta/quanta-editor/utils"
import DropdownInput from "./form-elements/dropdown-input"
import FileInput from "./form-elements/file-input/file-input"
import TextInputQuanta from "./form-elements/text-input"

interface IFormBuilderProps {
    forms: IQuantaFormField[],
    closeModal: () => void,
    submit: (forms: IQuantaFormField[], valStore: {[key: string]: any}) => void,
    defaultValue?: {[key: string]: any}
}

const FormBuilder: React.FC<IFormBuilderProps> = ({ forms, closeModal, submit, defaultValue }) => {
    const [valStore, setValStore] = useState<{[key: string]: any}>({})

    useEffect(() => {
        if(defaultValue === undefined)
            return

        let defaultKeys = Object.keys(defaultValue)
        let nValStore = valStore

        for(let i = 0; i < defaultKeys.length; i++) {
            let key = defaultKeys[i]
            let value = defaultValue[key]
            nValStore[key] = value
        }

        setValStore({ ...nValStore })
    }, [defaultValue])

    function getValue(id: string) {
        return valStore[id]
    }

    function setValue(id: string, val: any) {
        let nValStore = valStore
        nValStore[id] = val

        setValStore({ ...nValStore })
    }

    return (
        <div>
            <Stack spacing={"md"}>
                {forms.map((step) => {
                    let inputType = step.type
                    if(inputType === undefined)
                        return

                    if(inputType === "text")
                        return (
                            <TextInputQuanta 
                                name={step.name}
                                icon={step.icon}
                                value={getValue(step.id!)}
                                setValue={(id: string) => setValue(step.id!, id)}
                            />
                        )

                    if(inputType === "dropdown") {
                        let dropdownGroup = step.dropdownField
                        if(dropdownGroup === undefined)
                            return

                        let dropdownItems = convertTypesToDropdown(dropdownGroup)
                        if(dropdownItems === undefined)
                            return

                        return (
                            <DropdownInput
                                items={dropdownItems}
                                name={step.name}
                                value={getValue(step.id!)}
                                setValue={(value: string) => setValue(step.id!, value)}
                            />
                        )
                    }

                    if(inputType === "file") {
                        let fileType = step.fileType
                        let fileName = step.name
                        if(fileType === undefined || fileName === undefined)
                            return

                        return (
                            <FileInput 
                                fileType={fileType}
                                fileName={fileName}
                                setValue={(val: any) => setValue(step.id!, val)}
                            /> 
                        )
                    }
                })}

                <Group position={"right"}>
                    <Button
                        variant={'subtle'}
                        color={'red'}
                        size={'xs'}
                        px={'xs'}
                        onClick={() => { closeModal() }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant={'subtle'}
                        color={'indigo'}
                        size={'xs'}
                        px={'xs'}
                        onClick={() => { submit(forms, valStore) }}
                    >
                        Create
                    </Button>
                </Group>
            </Stack>
        </div>
    )
}

export default FormBuilder