import styles   from './toolbar.module.scss'
import Explorer from '../explorer/explorer'

import { useState } from 'react'

import { IconStack2, IconStackPop } from '@tabler/icons'
import { 
    Tooltip, 
    UnstyledButton,
    Text 
}  from '@mantine/core'

const stacks = [
    {
        id: 'explorer',
        name: "Project Explorer",
        icon: IconStack2
    },
]

/**
 * @description
 *  this is the toolbar for the lunar editor.
 *  when in the lunar editor, its the container on the left side of the space,
 *  next to the display viewport.
 * @returns Lunar Editor Toolbar 
 */
const Toolbar: React.FC = ({ }): JSX.Element => {
    const [stack, setStack]   = useState<any>(stacks[0])
    
    const explorerIcons = stacks.map((step) => (
        <Tooltip
            label={step.name}
            position={'right'}
            withArrow
        >
            <UnstyledButton 
                className={`${styles.item} ${stack.id === step.id ? styles.active : ''}`}
                onClick={() => { setStack(step) }}
            >
                <step.icon stroke={2} />
            </UnstyledButton>
        </Tooltip>
    ))

    return (
        <div className={styles.wrapper}>
            <div className={styles.stackExplorer}>
                <div className={styles.stack}>
                    {explorerIcons}
                </div>
            </div>

            <div className={styles.stackViewport}>
                <div className={styles.title}>
                    <Text 
                        size={"xs"}
                        weight={"bold"}
                        color={"dimmed"}
                        transform={"uppercase"}
                    >
                        {stack.name}
                    </Text>
                </div>

                <div style={{ marginTop: 0, position: 'relative', height: '100%' }}>
                    {stack.id === "explorer" && (
                        <Explorer />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Toolbar