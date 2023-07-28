import { useCallback, useContext, useEffect, useState } from "react"
import { IFormPart, IMultiCollectedPayload } from "../../../ui/multi-form/types"
import MultiForm from "../../../ui/multi-form"
import DatasetFormStep, { IDatasetOutput } from "./dataset"
import IndicatorFormStep, { IIndicatorOutput } from "./indicator"
import { IQuantaIndicatorShell } from "../../../ui/quanta-dataset-manager/types"
import { LunarContextData } from "../../../data/lunar/context"
import { ILunarState } from "../../../data/lunar/types/types"

interface IFormProps {
    modalState: string | null | undefined,
    close: () => void,
}

const AddQuantaIndicatorForm: React.FC<IFormProps> = ({ modalState, close }) => {
    const [formParts, setFormParts] = useState<IFormPart[]>([])

    const { addQuantaIndicator, ui } = useContext(LunarContextData) as ILunarState

    //effects for the add form
    useEffect(() => {
        if(modalState !== "add_indicator")
            return

        const newFormParts: IFormPart[] = [
            {
                title: "Select Dataset",
                type: "raw",
                rawFragment: DatasetFormStep,
                outputKey: "dataset"
            },
            {
                title: "Select Indicator",
                type: "raw",
                outputKey: "indicator",
                rawFragment: IndicatorFormStep
            }
        ]

        setFormParts([ ...newFormParts ])
    }, [modalState])

    //methods for the multi form component
    const cancel = useCallback(() => {
        setFormParts([])
        close()
    }, [])

    //TODO: Implement the submit functionality
    const submit = useCallback((payload: IMultiCollectedPayload) => {
        let collectedKeys = Object.keys(payload)
        let visualId = ui?.visual_id
        if(collectedKeys.includes('dataset') === false || collectedKeys.includes('indicator') === false || visualId === undefined)
            return

        let datasetValue = payload['dataset']
        let indicatorValue = payload['indicator']
        if(datasetValue === undefined || indicatorValue === undefined)
            return

        let datasetParsed: IDatasetOutput = JSON.parse(datasetValue)
        let indicatorParsed: IIndicatorOutput = JSON.parse(indicatorValue)
        if(datasetParsed.datasetId === undefined || indicatorParsed.indicatorId === undefined)
            return

        let shell: IQuantaIndicatorShell = {
            datasetId: datasetParsed.datasetId,
            indicatorId: indicatorParsed.indicatorId
        }

        addQuantaIndicator(visualId, shell)
    }, [ui, addQuantaIndicator])
    
    return (
        <MultiForm
            formParts={formParts}
            cancel={cancel}
            submit={submit}
        />
    )
}

export default AddQuantaIndicatorForm