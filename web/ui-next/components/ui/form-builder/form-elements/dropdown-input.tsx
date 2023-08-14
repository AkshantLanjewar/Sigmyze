import { Text } from "@mantine/core"
import { useEffect, useState } from "react"
import { IUIDropdownItem } from "../../ui-dropdown/types"
import UIDropdown from "../../ui-dropdown/ui-dropdown"

interface IDropdownInput {
    items: IUIDropdownItem[],
    name?: string,
    value?: string,
    testId?: string,
    setValue?: (value: string) => void
}

const DropdownInput: React.FC<IDropdownInput> = ({ items, name, value, testId, setValue }) => {
    const [internalTestId, setInternalTestId] = useState<string>("")
    
    useEffect(() => {
        if(items === undefined)
            return
        if(setValue === undefined)
            return
        if(value === undefined && items.length > 0)
            setValue(items[0].id)
    }, [items])

    useEffect(() => {
        if(testId === undefined)
            return

        setInternalTestId(testId)
    }, [testId])

    return (
        <div data-testId={internalTestId}>
            {value !== undefined && (
                <>
                    <Text
                        size={"sm"}
                        weight={500}
                        pb={2.5}
                    >
                        {name}
                    </Text>

                    <UIDropdown
                        items={items}
                        emitChange={(id: string) => setValue ? setValue(id) : null}
                        value={value}
                        size={"sm"}
                        expand={true}
                        radius={"sm"}
                        position={'bottom-start'}
                    />
                </>
            )}
        </div>
    )
}

export default DropdownInput