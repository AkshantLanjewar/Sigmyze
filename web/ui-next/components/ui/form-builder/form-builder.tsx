import { Button, Group, LoadingOverlay, Stack } from "@mantine/core"
import { useEffect, useState } from "react"
import { IQuantaFormField } from "../../quanta/quanta-editor/types/form"
import FormElement from "./form-element"

interface IFormBuilderProps {
    forms: IQuantaFormField[],
    closeModal: () => void,
    submit: (forms: IQuantaFormField[], valStore: {[key: string]: any}) => void,
    defaultValue?: {[key: string]: any},
    loading?: boolean,
    loadingStr?: string,
    submitText?: string
}

const FormBuilder: React.FC<IFormBuilderProps> = ({ 
    forms, 
    closeModal, 
    submit, 
    defaultValue, 
    loadingStr,
    submitText 
}) => {
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
        <div style={{ position: 'relative' }}>
            <LoadingOverlay
                visible={loadingStr ? true : false}
                overlayBlur={2}
            />

            <Stack spacing={"md"}>
                {forms.map((step) => (
                    <FormElement 
                        step={step}
                        valStore={valStore}
                        getValue={getValue}
                        setValue={setValue}
                    />
                ))}

                <Group position={"right"}>
                    <Button
                        variant={'subtle'}
                        color={'red'}
                        size={'xs'}
                        px={'xs'}
                        data-testId={'cancel-button'}
                        onClick={() => { closeModal() }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant={'subtle'}
                        color={'indigo'}
                        size={'xs'}
                        px={'xs'}
                        data-testId={'submit-button'}
                        onClick={() => { submit(forms, valStore) }}
                    >
                        {submitText
                            ? submitText
                            : "Create"
                        }
                    </Button>
                </Group>
            </Stack>
        </div>
    )
}

export default FormBuilder