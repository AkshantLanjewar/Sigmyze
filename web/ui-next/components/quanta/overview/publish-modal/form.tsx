import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { IQuantaFormField } from "../../quanta-editor/types/form"
import FormBuilder from "../../../ui/form-builder/form-builder"
import { IconBook2, IconBuilding, IconCurrencyCent, IconSignature, IconWorldWww, IconWritingSign } from "@tabler/icons"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import { IPublishDatasetPOST, PublishDataset } from "../../../data/quanta/quanta-publish-api"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"

interface IFormProps {
    close: () => void
}

const PublishForm: React.FC<IFormProps> = ({ close }) => {
    const [loadingStr, setLoadingStr] = useState<string | undefined>(undefined)
    const [defaultValue, setDefaultValue] = useState<{[key: string]: any} | undefined>(undefined)
    const loaded = useRef<boolean>(false)

    const { project_data, quantaId, organizationId, togglePublishUpdate } = useContext(QuantaContextData) as IQuantaState
    const { authData } = useContext(UserContextData) as IUserContext

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

        nDefaultValue['visibility'] = 'public'
        setDefaultValue({ ...nDefaultValue })
    }, [project_data])

    const formComponents: IQuantaFormField[] = useMemo(() => ([
        {
            name: "Dataset Title",
            type: "text",
            icon: <IconSignature />,
            id: "title",
            testId: "publish-title-input"
        },
        {
            name: "Dataset ID",
            id: "dataset_id",
            type: "text",
            icon: <IconWritingSign />,
            testId: "publish-dataset-id"
        },
        {
            name: "Dataset Description",
            id: "description",
            type: "text",
            icon: <IconBook2 />,
            testId: "publish-dataset-description"
        },
        {
            id: "dynamicPublic",
            type: "dynamic",
            dynamicConfig: {
                dependsOn: "visibility",
                dependValue: "public",
                dynamicProperty: "visibility",
                dynamicContent: {
                    name: "Public Publishing Token",
                    id: "publish_token",
                    type: "text",
                    icon: <IconCurrencyCent />
                }
            }
        },
        {
            name: "Visibility",
            id: "visibility",
            type: "segment",
            testId: "publish-dataset-segment",
            segmentItems: [
                {
                    value: "public",
                    name: "Public",
                    icon: <IconWorldWww />,
                },
                {
                    value: "private",
                    name: "Local",
                    icon: <IconBuilding />
                }
            ]
        },
    ] as IQuantaFormField[]), [])

    const submit = useCallback((_forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        async function main() {
            setLoadingStr('loading')
            let valKeys = Object.keys(valStore)
            let postData = {} as IPublishDatasetPOST

            //get the form data and put it in the post data
            let token = authData?.token
            if(valKeys.includes('title') === false || valKeys.includes('dataset_id') === false || valKeys.includes('description') === false)
                return
            if(quantaId === null || organizationId === null || token === undefined)
                return

            postData.title = valStore['title']
            postData.datasetId = valStore['dataset_id']
            postData.description = valStore['description']
            postData.quantaId = quantaId
            postData.organizationId = organizationId

            if(valKeys.includes('visibility') === false)
                return

            let visibilityValue = valStore['visibility']
            postData.public = false

            switch(visibilityValue) {
                case "public":
                    if(valKeys.includes('publish_token') === false)
                        return

                    let publishedToken = valStore['publish_token']
                    postData.public = true
                    postData.publicToken = publishedToken
                    break
                default: return
            }

            await PublishDataset(token, postData)
            setLoadingStr(undefined)
            togglePublishUpdate()

            close()
        }

        main()
    }, [quantaId, organizationId, togglePublishUpdate])
    
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