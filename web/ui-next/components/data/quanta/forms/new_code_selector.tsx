import { IconBoxMargin, IconWriting } from "@tabler/icons"
import { IQuantaFormField } from "../../../quanta/quanta-editor/types/form"
import FormBuilder from "../../../ui/form-builder/form-builder"
import { useContext } from "react"
import { UserContextData } from "../../user/context"
import { IUserContext } from "../../user/types"
import { QuantaContextData } from "../context"
import { IQuantaState } from "../types"
import { showNotification } from "@mantine/notifications"
import { CreateQuantaProject } from "../quanta-code-context/quanta-code-api"
import { QuantaCodeContextData } from "../quanta-code-context"
import { IQuantaCodeContext } from "../quanta-code-context/state"

interface INewSelectorFormProps {
    closeModal: () => void
}

const NewCodeSelector: React.FC<INewSelectorFormProps> = ({ closeModal }) => {
    const { authData } = useContext(UserContextData) as IUserContext
    const { quantaId } = useContext(QuantaContextData) as IQuantaState
    const { toggleFetch } = useContext(QuantaCodeContextData) as IQuantaCodeContext

    const formFields = [
        {
            type: "text",
            name: "Selector Name",
            id: "selector_name",
            icon: <IconWriting />
        },
        {
            type: "text",
            name: "Selector Id",
            id: "selector_id",
            icon: <IconBoxMargin />
        }
    ] as IQuantaFormField[]

    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        async function main() {
            let token = authData?.token
            if(token === undefined || quantaId === null)
                return

            let selector_name = valStore['selector_name']
            let selector_id = valStore['selector_id']

            if(typeof selector_name !== 'string' || selector_name.length === 0)
                showNotification({
                    title: "Create Error",
                    message: `Please type a valid name for the selector`,
                    color: 'red',
                    autoClose: 1000 * 10
                })

            if(typeof selector_id !== 'string' || selector_id.length === 0)
                showNotification({
                    title: "Create Error",
                    message: `Please type a valid name for the selector_id`,
                    color: 'red',
                    autoClose: 1000 * 10
                })

            await CreateQuantaProject(token, quantaId, selector_name, selector_id)
            toggleFetch()
            closeModal()
        }

        main()
    }
    
    return (
        <div>
            <FormBuilder
                forms={formFields}
                submit={submit}
                closeModal={closeModal}
            />
        </div>
    )
}

export default NewCodeSelector