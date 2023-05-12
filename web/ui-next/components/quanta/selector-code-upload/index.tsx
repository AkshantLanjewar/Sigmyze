import { ActionIcon, Group, Stack, UnstyledButton } from '@mantine/core'
import styles from './selector-code.module.scss'
import { IconCode, IconFileZip } from '@tabler/icons'
import { useContext, useEffect, useState } from 'react'
import ModalManager from '../../ui/modal-manager'
import { SelectorPaneContextData } from '../selector-pane/context'
import { ISelectorPaneState } from '../selector-pane/context/types'
import UploadModal from './upload-modal'

const SelectorCodeUpload: React.FC = ({ }) => {
    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)

    const [codeTitle, setCodeTitle] = useState<string | null>(null)
    const { selectorCode } = useContext(SelectorPaneContextData) as ISelectorPaneState

    useEffect(() => {
        if(selectorCode === null) {
            setCodeTitle(null)
            return
        }

        let title = selectorCode.schemaName
        setCodeTitle(title)
    }, [selectorCode])
    
    return (
        <>
            <ModalManager
                modalState={modalState}
                close={closeModal}
            >
                <ModalManager.Modal
                    id={"upload"}
                    title={"Upload Source Code"}
                >
                    <UploadModal closeModal={closeModal} />
                </ModalManager.Modal>
            </ModalManager>

            <UnstyledButton 
                className={styles.file__button}
                onClick={() => setModalState("upload")}
            >
                <ActionIcon
                    color={'indigo'}
                    size={'xl'}
                    variant={'filled'}
                    radius={'md'}
                >
                    <IconFileZip />
                </ActionIcon>

                <Stack spacing={5}>
                    <div className={styles.file__name}>
                        {codeTitle
                            ? codeTitle
                            : ("Upload Source Code")
                        }
                    </div>

                    <Group spacing={2.5}>
                        <IconCode size={14} color={"#3b5bdb"} /> 
                        <div className={styles.file__type}>.zip file</div>
                    </Group>
                </Stack>
            </UnstyledButton>
        </>
    )
}

export default SelectorCodeUpload