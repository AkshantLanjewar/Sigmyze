import { IconAnalyze, IconSignature } from "@tabler/icons"
import { useContext } from "react"
import { v4 } from "uuid"
import { IQuantaFormField } from "../../../quanta/quanta-editor/types/types"
import FormBuilder from "../../../ui/form-builder/form-builder"
import { QuantaContextData } from "../context"
import { IQuantaState } from "../types"

interface INewFieldForm {
    closeModal: () => void
}

const NewFieldForm: React.FC<INewFieldForm> = ({ closeModal }) => {
    const { getSchema, createElement } = useContext(QuantaContextData) as IQuantaState
    
    const formFields = [
        {
            type: "text",
            name: "Field Name",
            icon: <IconSignature />,
            id: "field_name"
        }
    ] as IQuantaFormField[]

    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        let schema = getSchema("dataset")
        let field_name = valStore['field_name']
        
        if(typeof field_name !== 'string')
            return
        if(schema === undefined)
            return

        createElement("dataset", v4(), field_name)
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

export default NewFieldForm