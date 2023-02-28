import { Button, Group, Stack } from "@mantine/core"
import { useState } from "react"
import { IQuantaFormField } from "../quanta-editor/types"
import { convertTypesToDropdown } from "../quanta-editor/utils"
import DropdownInput from "./dropdown-input"
import TextInputQuanta from "./text-input"

interface IFormBuilderProps {
    forms: IQuantaFormField[],
    closeModal: () => void,
    submit: (forms: IQuantaFormField[], valStore: {[key: string]: string}) => void
}

const FormBuilder: React.FC<IFormBuilderProps> = ({ forms, closeModal, submit }) => {
    const [valStore, setValStore] = useState<{[key: string]: string}>({})

    function getValue(id: string) {
        return valStore[id]
    }

    function setValue(id: string, val: string) {
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