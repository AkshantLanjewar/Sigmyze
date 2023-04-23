import { ReactNode } from "react"

interface IModalManagerModalProps {
    id: string,
    title: string,
    children: ReactNode
}

const ModalManagerModal: React.FC<IModalManagerModalProps> = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    )
}

export type { IModalManagerModalProps }
export default ModalManagerModal