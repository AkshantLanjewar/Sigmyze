import { useCallback, useContext, useMemo, useState } from "react"
import { IQuantaFormField } from "../../quanta-editor/types/form"
import { IconAlertCircle, IconSignature } from "@tabler/icons"
import FormBuilder from "../../../ui/form-builder/form-builder"
import { showNotification } from "@mantine/notifications"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"
import { IUnpublishDatasetPOST, UnpublishDataset } from "../../../data/quanta/quanta-publish-api"

interface IFormProps {
    close: () => void
}

const UnpublishForm: React.FC<IFormProps> = ({ close }) => {
    const [loadingStr, setLoadingStr] = useState<string | undefined>(undefined)

    const { quantaId, organizationId } = useContext(QuantaContextData) as IQuantaState
    const { authData } = useContext(UserContextData) as IUserContext

    const formComponents: IQuantaFormField[] = useMemo(() => ([
        {
            type: "alert",
            alertIcon: <IconAlertCircle />,
            alertTitle: "Attention",
            alertContent: "You are about to unpublish this dataset. Any users who were using this dataset in a work environment will immediately loose access. Type affirm to continue",
            alertColor: "orange"
        },
        {
            name: "Confirmation",
            type: "text",
            icon: <IconSignature />,
            id: "affirm"
        }
    ] as IQuantaFormField[]), [])

    const submit = useCallback((_forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        async function main() {
            let token = authData?.token
            if(token === undefined || quantaId === null || organizationId === null)
                return
            
            setLoadingStr("swag")
            let valKeys = Object.keys(valStore)
            if(valKeys.includes('affirm') === false) {
                showNotification({
                    title: "Unpublish Error",
                    message: `please type affirm in the text box`,
                    color: 'red',
                    autoClose: 1000 * 10
                })

                setLoadingStr(undefined)
                return
            }

            let data: IUnpublishDatasetPOST = {
                quantaId,
                organizationId
            }

            try { await UnpublishDataset(token, data) } catch (error) {}
            setLoadingStr(undefined)
            close()
        }

        main()
    }, [quantaId, organizationId, authData])

    return (
        <>
            <FormBuilder
                forms={formComponents}
                loadingStr={loadingStr}
                closeModal={close}
                submit={submit}
            />
        </>
    )
}

export default UnpublishForm