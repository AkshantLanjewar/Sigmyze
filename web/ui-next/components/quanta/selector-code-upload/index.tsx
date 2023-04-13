import { ActionIcon, Group, Stack, UnstyledButton } from '@mantine/core'
import styles from './selector-code.module.scss'
import { IconCode, IconFileZip } from '@tabler/icons'
import { useContext, useState } from 'react'
import ModalManager from '../../ui/modal-manager'
import { IQuantaFormField } from '../quanta-editor/types/form'
import FormBuilder from '../../ui/form-builder/form-builder'
import { v4 } from 'uuid'
import { SelectorPaneContextData } from '../selector-pane/context'
import { ISelectorPaneState } from '../selector-pane/context/types'

const SelectorCodeUpload: React.FC = ({ }) => {
    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)

    const { compileProject } = useContext(SelectorPaneContextData) as ISelectorPaneState

    const formComponents = [
        {
            type: "file",
            fileType: "zip",
            name: "Source Code",
            linkedKey: "source",
            id: v4()
        }
    ] as IQuantaFormField[]

    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        async function main() {
            let fileBytes = valStore['source']
            if(typeof fileBytes !== 'string')
                return

            await compileProject(fileBytes)
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
                    <div className={styles.file__name}>Upload Source Code</div>

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