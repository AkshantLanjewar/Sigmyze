import { memo } from "react";
import { IUIDropdownItem } from "../../../../ui/ui-dropdown/types";
import { Group } from "@mantine/core";
import UIDropdown from "../../../../ui/ui-dropdown/ui-dropdown";

interface IViewProps {
    selectedId: string | undefined,
    dropdownItems: IUIDropdownItem[] | undefined,
    subscribeClose: boolean,
    viewOnly: boolean,
    emitChange: (id: string) => void
}

const NodeTypeSelectorView: React.FC<IViewProps> = memo(({
    selectedId,
    dropdownItems,
    subscribeClose,
    viewOnly,
    emitChange
}) => {
    return (
        <Group position={"center"}>
            {selectedId !== undefined && (
                <UIDropdown 
                    items={dropdownItems}
                    value={selectedId}
                    subscribeClose={subscribeClose}
                    emitChange={(id) => emitChange(id)}
                    disabled={viewOnly}
                />
            )}
        </Group>
    )
})

export default NodeTypeSelectorView