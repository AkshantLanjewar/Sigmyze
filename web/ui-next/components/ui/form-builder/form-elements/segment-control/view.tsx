import { SegmentedControl, SegmentedControlItem } from "@mantine/core";
import { memo } from "react";

interface IViewProps {
    value: string,
    items: SegmentedControlItem[],
    internalTestId: string,
    setValue: (val: string) => void
}

const QuantaSegmentControlView: React.FC<IViewProps> = memo(({ 
    value, 
    items,
    internalTestId, 
    setValue 
}) => {
    return (
        <div data-testId={internalTestId}>
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
        </div>
    )
})

export default QuantaSegmentControlView