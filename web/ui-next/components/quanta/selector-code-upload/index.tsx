import { ActionIcon, Group, Stack, UnstyledButton } from '@mantine/core'
import styles from './selector-code.module.scss'
import { IconCode, IconFileZip } from '@tabler/icons'
import { useContext, useEffect, useRef, useState } from 'react'
import ModalManager from '../../ui/modal-manager'
import { SelectorPaneContextData } from '../selector-pane/context'
import { ISelectorPaneState } from '../selector-pane/context/types'
import dynamic from 'next/dynamic'
import { QuantaUIContextData } from '../../data/quanta/ui-context'
import { IQuantaUIState } from '../../data/quanta/ui-context/state'
import { WebContainer } from '@webcontainer/api'

/**
 * Here will be the testing specs in order to ensure that the SelectorCodeUpload function integrates properly into the website
 * 
 * There will be 3 tests in order to determine this
 * A mount test, to make sure the data works without any data loaded into the SelectorPaneContext
 * Then a test with dummy data to ensure it reacts to changes in the state
 * And finally, and E2E test, where the upload feature is tested, and the form is validated, if possible look into creating a dummy zip file to upload
 * 
 * The TestId's being inserted is as follows
 *  - upload-button -> this is the button that initiates the modal
 *  - code-title -> this is the title component on the button
 *  - source-input -> this is the file input in the form we need to validate
 * 
 * Mount Test
 *  - code-title = Upload Source Code
 * 
 * Dummy Data Test
 *  - dummy-object schema(IQuantaSelectorCode):
 *      - containerId: ""
 *      - schemaId: ""
 *      - schemaName: "Dummy Name"
 *      - schemaItems: []
 *      - sourceCode: ""
 *      - defaultValue: ""
 *  - code-title = Dummy Name
 * 
 * E2E Test
 *  - validate code-title = Upload Source Code
 *  - click on upload-button
 *  - validate source-input = Source Code
 */

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
                data-testId={"upload-button"}
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
                    <div 
                        className={styles.file__name}
                        data-testId={"code-title"}
                    >
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