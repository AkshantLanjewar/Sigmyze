import { Checkbox } from "@mantine/core"
import { useCallback, useEffect, useState } from "react"

interface ICheckboxInputProps {
    name?: string,
    testId?: string,
    setValue?: (value: string) => void
}

const CheckboxInput: React.FC<ICheckboxInputProps> = ({ name, testId, setValue }) => {
    const [checked, setChecked] = useState<boolean>(false)

    const setValueCB = useCallback((value: string) => {
        if(setValue === undefined)
            return

        setValue(value)
    }, [setValue])

    useEffect(() => {
        if(checked === true)
            setValueCB("true")
        else
            setValueCB("false")
    }, [checked])

    return (
        <div data-testId={testId}>
            <Checkbox
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
                label={name}
            />
        </div>
    )
}

export default CheckboxInput