import { useCallback, useEffect, useState } from "react";
import { ISegmentItem } from "../../../../quanta/quanta-editor/types/form";
import { Center, Group, SegmentedControlItem } from "@mantine/core";
import QuantaSegmentControlView from "./view";

interface ISegmentedControlProps {
    value?: string,
    segmentItems?: ISegmentItem[],
    setValue?: (val: string) => void
}

const QuantaSegmentControl: React.FC<ISegmentedControlProps> = ({
    value,
    segmentItems,
    setValue
}) => {
    const [internalValue, setInternalValue] = useState<string>('')
    const [internalItems, setInternalItems] = useState<SegmentedControlItem[]>([])

    const internalSetValue = useCallback((val: string) => {
        if(setValue === undefined)
            return

        setValue(val)
    }, [setValue])

    useEffect(() => {
        if(value === undefined)
            return

        setInternalValue(value)
    }, [value])

    useEffect(() => {
        if(segmentItems === undefined)
            return

        let nInternalItems = [] as SegmentedControlItem[]
        for(let i = 0; i < segmentItems.length; i++) {
            let item = segmentItems[i]
            let obj = {} as SegmentedControlItem

            obj.value = item.value
            obj.label = (
                <Group 
                    position={"center"}
                    align={"center"}
                    spacing={5}  
                >
                    {item.icon}
                    {item.name}
                </Group>
            )

            nInternalItems.push(obj)
        }

        setInternalItems([ ...nInternalItems ])
    }, [segmentItems])

    return (
        <QuantaSegmentControlView
            value={internalValue}
            items={internalItems}
            setValue={internalSetValue}
        />
    )
}

export default QuantaSegmentControl