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
            size={"60%"}
            centered
            styles={(theme) => ({
                modal: {
                    background: "#101113"
                }
            })}
        >
            <PublishForm close={close} />

            <Group position={"right"}>
                <Button
                    variant={'subtle'}
                    color={'indigo'}
                    size={'xs'}
                    px={'xs'}
                    onClick={() => {  }}
                >
                    Cancel
                </Button>

                <Button
                    variant={'subtle'}
                    color={'red'}
                    size={'xs'}
                    px={'xs'}
                    onClick={() => { }}
                >
                    Publish
                </Button>
            </Group>
        </Modal>
    )
})

export default PublishModal