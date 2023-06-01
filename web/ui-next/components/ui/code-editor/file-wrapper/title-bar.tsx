import { useContext, MouseEvent } from 'react'
import styles from './index.module.scss'
import { CodeEditorContextData } from '..'
import { ICodeEditorState } from '../state'

import { ActionIcon, Text, Tooltip } from '@mantine/core'
import { IconFile, IconFolder, IconTrash } from '@tabler/icons'

const FileTitleBar: React.FC = ({ }) => {
    const { activeDirectory, openModal, name } = useContext(CodeEditorContextData) as ICodeEditorState
    
    const openModalWrapper = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, modal: string) => {
        e.stopPropagation()
        openModal(modal)
    }

    return (
        <div className={styles.title}>
            <Text 
                size={"sm"}
                weight={"bold"}
                color={"dimmed"}
                transform={"uppercase"}
            >
                {name}
            </Text>

            <div className={styles.actions}>
                <Tooltip
                    label={activeDirectory ? null : "Delete Selector"}
                    position={'bottom-start'}
                    color={'black'}
                    withArrow
                >
                    <ActionIcon
                        size={28}
                        color={"red"}
                        variant={"outline"}
                        radius={"xs"}
                        onClick={(e) => openModalWrapper(e, "delete-selector")}
                    >
                        <IconTrash size={18} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip
                    label={"Create Folder"}
                    position={'bottom-start'}
                    color={'black'}
                    withArrow
                >
                    <ActionIcon
                        size={28}
                        color={"gray"}
                        variant={"light"}
                        radius={"xs"}
                    >
                        <IconFolder 
                            size={18} 
                            fill='#c1c2c5'
                            color={"#c1c2c5"} 
                            fillOpacity={1} 
                        />
                    </ActionIcon>
                </Tooltip>

                <Tooltip
                    label={"Create File"}
                    position={'bottom-end'}
                    color={'black'}
                    withArrow
                >
                    <ActionIcon
                        size={28}
                        color={"gray"}
                        variant={"light"}
                        radius={"xs"}
                    >
                        <IconFile 
                            size={18} 
                            fill='#c1c2c5'
                            color={"#c1c2c5"} 
                            fillOpacity={1} 
                        />
                    </ActionIcon>
                </Tooltip>
            </div>
        </div>
    )
}

export default FileTitleBar