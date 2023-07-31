import { SegmentedControl, SegmentedControlItem } from "@mantine/core";
import { memo } from "react";

interface IViewProps {
    value: string,
    items: SegmentedControlItem[],
    setValue: (val: string) => void
}

const QuantaSegmentControlView: React.FC<IViewProps> = memo(({ value, items, setValue }) => {
    return (
        <>
            <SegmentedControl
                value={value}
                data={items}
                onChange={setValue}
                size={"sm"}
                radius={"xl"}
                mb={"md"}
                transitionTimingFunction={"linear"}
                color={"indigo"}
            />
        </>
    )
})

export default QuantaSegmentControlView