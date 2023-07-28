import { Modal } from "@mantine/core"
import { memo } from "react"
import UnpublishForm from "./form"

interface IUnpublishModalProps {
    opened: boolean,
    close: () => void
}

const UnpublishModal: React.FC<IUnpublishModalProps> = memo(({ opened, close }) => (
    <Modal
        title={"Publish Dataset"}
        opened={opened}
        onClose={close}
        size={600}
        centered
        styles={(theme) => ({
            modal: {
                background: "#101113"
            }
        })}
    >
        <UnpublishForm close={close} />
    </Modal>
))

export default UnpublishModal