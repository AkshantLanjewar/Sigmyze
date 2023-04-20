import { ActionIcon, Group, Stack, UnstyledButton } from '@mantine/core'
import styles from './selector-code.module.scss'
import { IconCode, IconFileZip } from '@tabler/icons'
import { useContext, useEffect, useState } from 'react'
import ModalManager from '../../ui/modal-manager'
import { IQuantaFormField } from '../quanta-editor/types/form'
import FormBuilder from '../../ui/form-builder/form-builder'
import { v4 } from 'uuid'
import { SelectorPaneContextData } from '../selector-pane/context'
import { ISelectorPaneState } from '../selector-pane/context/types'
import { ICompileProjectResult } from '../selector-pane/context/functions'

const SelectorCodeUpload: React.FC = ({ }) => {
    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)

    const [codeTitle, setCodeTitle] = useState<string | null>(null)

    const { compileProject, initialized, setTestSource, selectorCode } = useContext(SelectorPaneContextData) as ISelectorPaneState

    useEffect(() => {
        if(selectorCode === null) {
            setCodeTitle(null)
            return
        }

        let title = selectorCode.schemaName
        setCodeTitle(title)
    }, [selectorCode])

    const formComponents = [
        {
            type: "file",
            fileType: "zip",
            name: "Source Code",
            linkedKey: "source",
            id: "source"
        }
    ] as IQuantaFormField[]

    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        if(initialized !== true)
            return

        async function main() {
            let fileBytes = valStore['source']
            if(typeof fileBytes !== 'string')
                return

            let result: ICompileProjectResult = await compileProject(fileBytes)
            if(result.error === true) {

            } else {
                let htmlSource = result.htmlOutput
                setTestSource(htmlSource)

                htmlSource = null
                result.htmlOutput = null
            }

            closeModal()
        }

        main()
    }
    
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
                    <FormBuilder
                        forms={formComponents}
                        submit={submit}
                        closeModal={closeModal}
                    />
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