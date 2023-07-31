import { IconBoxMargin, IconWriting } from "@tabler/icons"
import FormBuilder from "../../../ui/form-builder/form-builder"
import { QuantaContextData } from "../context"
import { IQuantaState } from "../types"
import { useContext } from "react"
import { IQuantaFormField } from "../../../quanta/quanta-editor/types/form"

interface INewSelectorFormProps {
    closeModal: () => void
}

const NewSelectorForm: React.FC<INewSelectorFormProps> = ({ closeModal }) => {
    const { newSelector } = useContext(QuantaContextData) as IQuantaState
    
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
        let selector_name = valStore['selector_name']
        let selector_id = valStore['selector_id']
        if(typeof selector_name !== 'string' || typeof selector_id !== 'string')
            return
        
        newSelector(selector_name, selector_id)
        closeModal()
    }
    
    return (
        <>
            <FormBuilder
                forms={formFields}
                submit={submit}
                closeModal={closeModal}
            />
        </>
    )
}

export default NewSelectorForm
