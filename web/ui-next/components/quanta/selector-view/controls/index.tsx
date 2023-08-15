import { Button, Group } from "@mantine/core"
import { memo } from "react"

interface IControlProps {
    selectedIndicator: string | undefined,
    selectHandler?: (indicatorId: string) => void,
    close: () => void
}

const PreviewControls: React.FC<IControlProps> = memo(({
    selectedIndicator,
    selectHandler,
    close
}) => {
    return (
        <div style={{ width: "100%" }}>
            <Group position={"center"} mt={"sm"}>
                <Button
                    variant="light"
                    color="red"
                    onClick={() => close()}
                    data-testId={"cancel-preview"}
                >
                    Cancel
                </Button>

                <Button
                    variant="light"
                    color="indigo"
                    disabled={selectedIndicator === undefined}
                    onClick={() => {
                        if(selectHandler === undefined || selectedIndicator === undefined)
                            return
                        
                        selectHandler(selectedIndicator)
                        close()
                    }}
                >
                    Submit
                </Button>
            </Group>
        </div>
    )
})

export default PreviewControls