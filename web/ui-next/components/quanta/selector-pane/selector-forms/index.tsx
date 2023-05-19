import ModalManager from "../../../ui/modal-manager"
import DeleteSelectorForm from "./delete-selector"

interface ISelectorFormsProps {
    modalState: string | null,
    closeModal: () => void,
    selectorId: string | null | undefined
}

const SelectorForms: React.FC<ISelectorFormsProps> = ({ modalState, closeModal, selectorId }) => {
    return (
        <>
            <ModalManager
                modalState={modalState}
                close={closeModal}
            >
                <ModalManager.Modal
                    id="delete_selector"
                    title="Delete Selector"
                >
                    <DeleteSelectorForm
                        close={closeModal}
                        selectorId={selectorId}
                    />
                </ModalManager.Modal>
            </ModalManager>
        </>
    )
}

export default SelectorForms