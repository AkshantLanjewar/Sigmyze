import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { IQuantaFormField } from "../../quanta-editor/types/form"
import FormBuilder from "../../../ui/form-builder/form-builder"
import { IconBook2, IconBuilding, IconSignature, IconWorldWww, IconWritingSign } from "@tabler/icons"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"

interface IFormProps {
    close: () => void
}

const PublishForm: React.FC<IFormProps> = ({ close }) => {
    const [loadingStr, setLoadingStr] = useState<string | undefined>(undefined)
    const [defaultValue, setDefaultValue] = useState<{[key: string]: any} | undefined>(undefined)
    const loaded = useRef<boolean>(false)

    const { project_data } = useContext(QuantaContextData) as IQuantaState

    useEffect(() => {
        if(project_data === undefined || loaded.current === true)
            return

        let nDefaultValue: {[key: string]: any} = {}
        let titleValue = project_data.dataset_name
        let idValue = project_data.dataset_id
        let descriptionValue = project_data.dataset_description

        if(titleValue !== undefined)
            nDefaultValue['title'] = titleValue
        if(idValue !== undefined)
            nDefaultValue['dataset_id'] = idValue
        if(descriptionValue !== undefined)
            nDefaultValue['description'] = descriptionValue

        setDefaultValue({ ...nDefaultValue })
    }, [project_data])

    const formComponents: IQuantaFormField[] = useMemo(() => ([
        {
            name: "Dataset Title",
            type: "text",
            icon: <IconSignature />,
            id: "title"
        },
        {
            name: "Dataset ID",
            id: "dataset_id",
            type: "text",
            icon: <IconWritingSign />
        },
        {
            name: "Dataset Description",
            id: "description",
            type: "text",
            icon: <IconBook2 />
        },
        {
            name: "Visibility",
            id: "visibility",
            type: "segment",
            segmentItems: [
                {
                    value: "public",
                    name: "Public",
                    icon: <IconWorldWww />
                },
                {
                    value: "private",
                    name: "Local",
                    icon: <IconBuilding />
                }
            ]
        }
    ] as IQuantaFormField[]), [])

    const submit = useCallback((forms: IQuantaFormField[], valStore: {[key: string]: any}) => {

    }, [])
    
    return (
        <>
            {defaultValue && (
                <FormBuilder
                    forms={formComponents}
                    defaultValue={defaultValue}
                    submit={submit}
                    closeModal={close}
                    loadingStr={loadingStr}
                />
            )}
        </>
    )
}

export default PublishForm