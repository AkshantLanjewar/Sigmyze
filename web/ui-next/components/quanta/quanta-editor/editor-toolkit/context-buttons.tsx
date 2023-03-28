import { Box, Button, Group } from "@mantine/core"

interface IContextButtonsProps {
    toggleEngineWrapper: () => void
}

const ContextButtons: React.FC<IContextButtonsProps> = ({ toggleEngineWrapper }) => {
    return (
        <Box style={{ position: 'absolute', right: 20, top: 20, zIndex: 200, pointerEvents: 'all' }}>
            <Group>
                <Button onClick={() => toggleEngineWrapper()}>
                    Execute
                </Button>
            </Group>
        </Box>
    )
}

export default ContextButtons