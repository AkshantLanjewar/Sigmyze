import { ActionIcon, Stack, Group } from '@mantine/core'
import { IconPlus, IconCode, IconBraces } from '@tabler/icons'
import { useState } from 'react'
import styles from './file-input.module.scss'

const FileInput: React.FC = ({ }) => {
    const [fileUploaded, setFileUploaded] = useState(false)

    return (
        <div className={styles.file__item}>
            <div className={styles.file__inner}>
                <ActionIcon
                    color={'violet'}
                    size={'xl'}
                    variant={fileUploaded ? 'filled' : 'outline'}
                    radius={"md"}
                    sx={{ borderWidth: 2 }}
                >
                    {fileUploaded
                        ? <IconBraces size={28} stroke={"2"} color={"#d0bfff"} />
                        : <IconPlus size={28} stroke={"2"} color={"#d0bfff"} />
                    }
                </ActionIcon>

                <Stack spacing={0}>
                    <div className={styles.file__name}>Source Code</div>

                    <Group spacing={2.5}>
                        <IconCode size={14} color={"#d0bfff"} />
                        <div className={styles.file__type}>.ts file</div>
                    </Group>
                </Stack>
            </div>
        </div>
    )
}

export default FileInput