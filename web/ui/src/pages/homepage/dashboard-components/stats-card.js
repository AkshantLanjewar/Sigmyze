import React from 'react'

import { 
    Center,
    Group,
    Paper,
    RingProgress, 
    Text
} from '@mantine/core'

const StatsCard = ({ }) => {
    return (
        <Paper radius={"lg"} p={"xs"} sx={(theme) => ({ backgroundColor: theme.colors.dark[9] })}>
            <Group>
                <RingProgress
                    size={80}
                    roundCaps
                    thickness={8}
                    sections={[{ value: 80, color: 'cyan' }]}
                    label={
                        <Center>
                            
                        </Center>
                    }
                />

                <div>
                    <Text color={"dimmed"} size={"xs"} transform={"uppercase"} weight={700}>
                        Charts Published
                    </Text>

                    <Text weight={700} size={"xl"}>
                        80
                    </Text>
                </div>
            </Group>
        </Paper>
    )
}

export default StatsCard