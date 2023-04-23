import { Modal } from "@mantine/core"
import React from "react"
import { useEffect, ReactElement, useState } from "react"
import ModalManagerModal, { IModalManagerModalProps } from "./modal"

interface IModalManagerProps {
    modalState: string | null,
    children: React.ReactNode
    close: () => void,
}

const ModalManager: React.FC<IModalManagerProps> & { Modal: typeof ModalManagerModal } = 
({ modalState, close, children }) => {
    const [fragment, setFragment] = useState<ReactElement | null>(null)

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