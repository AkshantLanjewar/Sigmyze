import { Text } from "@mantine/core"
import { useEffect } from "react"
import { IUIDropdownItem } from "../../ui-dropdown/types"
import UIDropdown from "../../ui-dropdown/ui-dropdown"

interface IDropdownInput {
    items: IUIDropdownItem[],
    name?: string,
    value?: string,
    setValue?: (value: string) => void
}

const DropdownInput: React.FC<IDropdownInput> = ({ items, name, value, setValue }) => {
    useEffect(() => {
        if(items === undefined)
            return
        if(setValue === undefined)
            return
        if(value === undefined && items.length > 0)
            setValue(items[0].id)
    }, [items])

    return (
        <div>
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