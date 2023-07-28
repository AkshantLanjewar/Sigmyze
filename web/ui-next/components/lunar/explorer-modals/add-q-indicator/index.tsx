import { Modal } from "@mantine/core"
import { memo } from "react"
import AddQuantaIndicatorForm from "./form"

//the flow for the form will be as follows
//1. select the dataset, from all the publicly selected datasets, and if logged in, all the datasets published in his organization
//2. get the selector data for that dataset
//3. set up the selector view, and retreive the indicator id
//4. add the indicator into the stored chart

interface IAddIndicatorProps {
    modalState: string | undefined | null,
    close: () => void,
}

const AddQIndicator: React.FC<IAddIndicatorProps> = memo(({ modalState, close }) => (
    <Modal
        opened={modalState === "add_indicator"}
        centered
        onClose={() => { close() }}
        overlayOpacity={0.55}
        overlayBlur={3}
        exitTransitionDuration={200}
        size={900}
        withCloseButton={false}
        sx={(theme) => ({
            '.mantine-Paper-root': {
                padding: 0,
                backgroundColor: theme.colors.dark[8]
            }
        })}
    >
        <AddQuantaIndicatorForm modalState={modalState} close={close} />
    </Modal>
))

export default AddQIndicator