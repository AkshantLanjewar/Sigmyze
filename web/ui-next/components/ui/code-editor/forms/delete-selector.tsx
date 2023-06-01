import { IconAlertCircle, IconWriting } from "@tabler/icons"
import { IQuantaFormField } from "../../../quanta/quanta-editor/types/form"
import FormBuilder from "../../form-builder/form-builder"
import { useContext } from "react"
import { CodeEditorContextData } from ".."
import { ICodeEditorState } from "../state"
import { showNotification } from "@mantine/notifications"
import { QuantaCodeContextData } from "../../../data/quanta/quanta-code-context"
import { IQuantaCodeContext } from "../../../data/quanta/quanta-code-context/state"
import { QuantaUIContextData } from "../../../data/quanta/ui-context"
import { IQuantaUIState } from "../../../data/quanta/ui-context/state"

interface IDeleteSelectorFormProps {
    closeModal: () => void
}

const DeleteSelectorForm: React.FC<IDeleteSelectorFormProps> = ({ closeModal }) => {
    const { name, code_id } = useContext(CodeEditorContextData) as ICodeEditorState
    const { deleteSelector } = useContext(QuantaCodeContextData) as IQuantaCodeContext
    const { closeTab, tabs } = useContext(QuantaUIContextData) as IQuantaUIState
    
    const formFields = [
        {
            type: "alert",
            alertColor: "orange",
            alertIcon: <IconAlertCircle />,
            alertTitle: "Warning!",
            alertContent: `Deleting this selector is a permanent action. In order to confirm, type the name [${name}] 
                in order to delete the selector
            `
        },
        {
            type: "text",
            name: "Selector Name",
            id: "selector_name",
            icon: <IconWriting />
        }
    ] as IQuantaFormField[]

    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        async function main() {
            let name_value = valStore['selector_name']
            if(typeof name_value !== 'string' || name_value.length === 0)
                showNotification({
                    title: "Delete Error",
                    message: `Please type the name of the project`,
                    color: 'red',
                    autoClose: 1000 * 10
                })
            
            if(tabs !== undefined) {
                let selectedTab = undefined
                for(let i = 0; i < tabs.length; i++) {
                    let tab = tabs[i]
                    if(tab.connected_file === code_id)
                        selectedTab = tab
                }

                let selectedTabId = selectedTab?.tabId
                if(selectedTabId !== undefined)
                    closeTab(selectedTabId)
            }

            await deleteSelector(code_id)
            closeModal()
        }

        main()
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

export default DeleteSelectorForm