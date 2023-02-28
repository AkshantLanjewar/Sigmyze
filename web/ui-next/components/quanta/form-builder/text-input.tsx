import { TextInput } from "@mantine/core"
import { useEffect } from "react"

interface ITextInputQuanta {
    name?: string,
    icon?: JSX.Element,
    value?: string,
    setValue?: (value: string) => void
}

const TextInputQuanta: React.FC<ITextInputQuanta> = ({ name, icon, value, setValue }) => {
    useEffect(() => {
        if(setValue === undefined)
            return
        if(value === undefined)
            setValue("")
    }, [value])

    return (
        <>
            {value !== undefined && (
                <TextInput
                    label={name}
                    placeholder={`Type ${name}`}
                    withAsterisk
                    radius={"xl"}
                    variant={'filled'}
                    icon={icon}
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
        </>
    )
}

export default TextInputQuanta