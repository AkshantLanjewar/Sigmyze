import { memo } from "react";
import { IDynamicConfig } from "../../../../quanta/quanta-editor/types/types";
import FormElement from "../../form-element";

interface IViewProps {
    dynamicConfig: IDynamicConfig,
    valStore: { [key: string]: any; },
    trackedValue: any,
    getValue(id: string): any,
    setValue(id: string, val: any): void
}

const DynamicElementView: React.FC<IViewProps> = memo(({
    dynamicConfig,
    valStore,
    trackedValue,
    getValue,
    setValue
}) => (
    <>
        {dynamicConfig.dynamicProperty === "visibility" && (
            dynamicConfig.dependValue === trackedValue
                ? (
                    <FormElement
                        step={dynamicConfig.dynamicContent}
                        valStore={valStore}
                        getValue={getValue}
                        setValue={setValue}
                    />
                )
                : null
        )}
    </>
))

export default DynamicElementView