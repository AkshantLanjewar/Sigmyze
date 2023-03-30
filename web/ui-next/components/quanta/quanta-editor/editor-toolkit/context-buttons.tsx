import { Box, Button, Group } from "@mantine/core"

interface IContextButtonsProps {
    hasCache: boolean,
    toggleEngineWrapper: () => void,
    toggleEngineCache: () => void
}

const ContextButtons: React.FC<IContextButtonsProps> = ({ hasCache, toggleEngineWrapper, toggleEngineCache }) => {
    return (
        <Box style={{ position: 'absolute', right: 20, top: 20, zIndex: 200, pointerEvents: 'all' }}>
            <Group>
                <Button
                    disabled={!hasCache}
                    onClick={() => toggleEngineCache()}
                >
                    Get Cache
                </Button>

                <Button onClick={() => toggleEngineWrapper()}>
                    Execute
                </Button>
            </Group>
        </Box>
    )
}

export default ContextButtons