import { IconAdjustments, IconAlertCircle } from "@tabler/icons"
import FormBuilder from "../../../ui/form-builder/form-builder"
import { useContext } from "react"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import { showNotification } from "@mantine/notifications"
import { IQuantaFormField } from "../../quanta-editor/types/form"

interface IDeleteSelectorFormProps {
    close: () => void,
    selectorId: string | null | undefined
}

const DeleteSelectorForm: React.FC<IDeleteSelectorFormProps> = ({ close, selectorId }) => {
    const { selectors, deleteSelector } = useContext(QuantaContextData) as IQuantaState
    
    let msg = `Please read carefully. Deleting this selector is a permanent action that cannot be undone.`
    msg += `To proceed, type the selectors name in the field below`
    
    const formFields = [
        {
            type: "alert",
            alertIcon: <IconAlertCircle size={"1rem"} />,
            alertTitle: "Attention!",
            alertColor: "red",
            alertContent: msg
        },
        {
            type: "text",
            name: "Selector Name",
            icon: <IconAdjustments />,
            id: "name"
        }
    ] as IQuantaFormField[]
    
    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        const errorMsg = (msg: string) => {
            showNotification({
                title: "Quanta Editor",
                message: msg,
                color: 'red',
                autoClose: 1000 * 5
            })
        }

        let selectorName = valStore['name']
        if(typeof selectorName !== 'string') {
            errorMsg("Please type a valid name")
            return
        }

        selectorName = selectorName.trim()
        let realName: string | undefined = undefined
        if(selectorName.length === 0) {
            errorMsg("Please type a valid name")
            return
        }

        for(let i = 0; i < selectors.length; i++) {
            let selector_ = selectors[i]
            if(selector_.selectorId === selectorId)
                realName = selector_.selectorName
        }

        if(realName !== selectorName) {
            errorMsg("Names dont match")
            close()
            return
        }

        //delete the selector
        deleteSelector(selectorId!)
        close()
    }
    
    return (
        <>
            <FormBuilder
                forms={formFields}
                submit={submit}
                closeModal={close}
                submitText="Delete"
            />
        </>
    )
}

export default DeleteSelectorForm