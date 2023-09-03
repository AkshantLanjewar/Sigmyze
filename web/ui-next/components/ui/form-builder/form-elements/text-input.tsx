import { TextInput } from "@mantine/core"
import { useEffect, useState } from "react"

interface ITextInputQuanta {
    name?: string,
    icon?: JSX.Element,
    value?: string,
    testingId?: string
    setValue?: (value: string) => void
}

const TextInputQuanta: React.FC<ITextInputQuanta> = ({ name, icon, value, setValue, testingId }) => {
    const [internalTestId, setInternalTestId] = useState<string>("")
    
    useEffect(() => {
        if(setValue === undefined)
            return
        if(value === undefined)
            setValue("")
    }, [value])

    useEffect(() => {
        if(testingId === undefined)
            return

        setInternalTestId(testingId)
    }, [testingId])

    return (
        <div data-testId={internalTestId}>
            {value !== undefined && (
                <TextInput
                    label={name}
                    placeholder={`Type ${name}`}
                    withAsterisk
                    radius={"xl"}
                    variant={'filled'}
                    value={value}
                    onChange={(e) => setValue ? setValue(e.target.value) : null}
                    icon={icon}
                    data-testId={`${testingId}-input`}
                    styles={{
                        icon: {
                            marginLeft: 10
                        },
                        input: {
                            paddingLeft: "45px!important"
                        }
                    }}
                />
            )}
        </div>
    )
}

export default TextInputQuanta