import { Button, Group, Modal } from "@mantine/core"
import { memo } from "react"
import PublishForm from "./form"

interface IPublishModalProps {
    opened: boolean,
    close: () => void
}

const PublishModal: React.FC<IPublishModalProps> = memo(({ opened, close }) => {
    return (
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
            <PublishForm close={close} />
        </Modal>
    )
})

export default PublishModal