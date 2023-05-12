import { ActionIcon, Group, Stack, UnstyledButton } from '@mantine/core'
import fileStyles from '../selector-code-upload/selector-code.module.scss'
import { useContext, useEffect, useState } from 'react'
import { IconCode, IconFileCode } from '@tabler/icons'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import ModalManager from '../../ui/modal-manager'
import CategoryUpload from './category-upload'

const CategoryMapper: React.FC = ({ }) => {
    const [fileName, setFileName] = useState<string | undefined>(undefined)
    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)

    const { categorization, updateCategorization, clearCategorization } = useContext(QuantaContextData) as IQuantaState
    
    useEffect(() => {
        if(categorization === undefined)
            return

        let fileName = categorization.fileName
        if(fileName === undefined) {
            clearCategorization()
            return
        }

        setFileName(fileName)
    }, [updateCategorization])

    return (
        <>
            <ModalManager
                modalState={modalState}
                close={closeModal}
            >
                <ModalManager.Modal
                    id={"upload"}
                    title={"Upload Categories Definition"}
                >
                    <CategoryUpload closeModal={closeModal} />
                </ModalManager.Modal>
            </ModalManager>

            <UnstyledButton 
                className={fileStyles.file__button}
                onClick={() => setModalState("upload")}
            >
                <ActionIcon
                    color={'indigo'}
                    size={'xl'}
                    variant={'filled'}
                    radius={'md'}
                >
                    <IconFileCode />
                </ActionIcon>

                <Stack spacing={5}>
                    <div className={fileStyles.file__name}>
                        {fileName
                            ? fileName
                            : ("Upload categories.json")
                        }
                    </div>

                    <Group spacing={2.5}>
                        <IconCode size={14} color={"#3b5bdb"} /> 
                        <div className={fileStyles.file__type}>.json file</div>
                    </Group>
                </Stack>
            </UnstyledButton>
        </>
    )
}

export default CategoryMapper