import { Modal } from "@mantine/core"
import React from "react"
import { useEffect, ReactElement, useState } from "react"
import ModalManagerModal, { IModalManagerModalProps } from "./modal"

/**
 * theese are the required props in order for the modal manager to function correctly
 */
interface IModalManagerProps {
    /**
     * this is the display state of the modal
     *  - when the modalstate = null, then the modal is closed
     *  - when the modalState has a value, it displays the react fragment who's modalId prop matches the active modal state
     */
    modalState: string | null,

    /**
     * this is the method that closes the modal, or in essence, sets the modalState to null
     */
    close: () => void,

    /**
     * all the child elements for the modal
     * NOTE: only ModalManagerModal's will be rendered within the actual modal
     */
    children: React.ReactNode,
}

const ModalManager: React.FC<IModalManagerProps> 
    & { Modal: typeof ModalManagerModal } 
    = ({ modalState, close, children }) => {
    //this is the active fragment being displayed within the modal body
    const [fragment, setFragment] = useState<ReactElement | null>(null)

    /**
     * this is the effect that fetches the correct fragment based on the modal state
     * if the modal state is null, no fragment will be found, otherwise the fragment
     * will be located from the children of the child ModalManagerModal's
     */
    useEffect(() => {
        if(children === null || children === undefined)
            return
        
        let element = null
        React.Children.forEach(children, (child: React.ReactNode) => {
            child = child as ReactElement<IModalManagerModalProps>
            if(child.props.id === modalState)
                element = child
        })

        setFragment(element)
    }, [modalState])
    
    return (
        <div>
            <Modal
                opened={fragment !== null}
                onClose={() => close()}
                title={fragment && fragment.props.title}
                centered
                overlayOpacity={0.55}
                overlayBlur={3}
                exitTransitionDuration={200}
            >
                {fragment}
            </Modal>
        </div>
    )
}

ModalManager.Modal = ModalManagerModal
export default ModalManager