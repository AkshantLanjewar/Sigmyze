import { ActionIcon, Group, Stack, UnstyledButton } from '@mantine/core'
import styles from './selector-code.module.scss'
import { IconCode, IconFileZip } from '@tabler/icons'
import { useContext, useEffect, useRef, useState } from 'react'
import ModalManager from '../../ui/modal-manager'
import { SelectorPaneContextData } from '../selector-pane/context'
import { ISelectorPaneState } from '../selector-pane/context/types'
import dynamic from 'next/dynamic'
import { WebContainer } from '@webcontainer/api'
import { QuantaUIContextData } from '../../data/quanta/ui-context'
import { IQuantaUIState } from '../../data/quanta/ui-context/state'

const UploadModal = dynamic(() => import('./upload-modal'), { ssr: false })

const SelectorCodeUpload: React.FC = ({ }) => {
    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)

    const [codeTitle, setCodeTitle] = useState<string | null>(null)
    const { selectorCode } = useContext(SelectorPaneContextData) as ISelectorPaneState
    const { getContainer, webcontainerCreated } = useContext(QuantaUIContextData) as IQuantaUIState

    const iframeRef = useRef<HTMLIFrameElement | null>(null)
    const containerRef = useRef<WebContainer | null>(null)

    //if the webcontainer is created, put it into the internal container ref
    useEffect(() => {
        if(webcontainerCreated === false)
            return

        let webcontainer = getContainer()
        containerRef.current = webcontainer
    }, [webcontainerCreated, getContainer])

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
                    <UploadModal closeModal={closeModal} containerRef={containerRef} />
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

            <iframe style={{ display: 'none' }} ref={iframeRef} />
        </>
    )
}

export default SelectorCodeUpload