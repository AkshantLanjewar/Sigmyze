import { useCallback, useEffect, useState } from "react";
import { IDynamicConfig } from "../../../../quanta/quanta-editor/types/types"
import DynamicElementView from "./view";

interface IDynamicElementProps {
    dynamicConfig: IDynamicConfig,
    valStore: { [key: string]: any; },
    getValue(id: string): any,
    setValue(id: string, val: any): void
}

const DynamicElement: React.FC<IDynamicElementProps> = ({
    dynamicConfig,
    valStore,
    getValue,
    setValue
}) => {
    const [trackedValue, setTrackedValue] = useState<any | undefined>(undefined)
    const [trackedId, setTrackedId] = useState<string | undefined>(undefined)

    //function that resets all the state to base value
    const resetState = useCallback(() => {
        setTrackedId(undefined)
        setTrackedValue(undefined)
    }, [])

    useEffect(() => {
        resetState()
        setTrackedId(dynamicConfig.dependsOn)
    }, [dynamicConfig])

    //whenever the valstore is updated
    useEffect(() => {
        let valKeys = Object.keys(valStore)
        if(trackedId === undefined || valKeys.includes(trackedId) === false)
            return

        let val = valStore[trackedId]
        setTrackedValue(val)
    }, [trackedId, valStore])

    return (
        <DynamicElementView
            dynamicConfig={dynamicConfig}
            valStore={valStore}
            trackedValue={trackedValue}
            getValue={getValue}
            setValue={setValue}
        />
    )
}

export default DynamicElement