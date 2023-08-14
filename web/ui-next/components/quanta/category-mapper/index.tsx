import { ActionIcon, Group, Stack, UnstyledButton } from '@mantine/core'
import fileStyles from '../selector-code-upload/selector-code.module.scss'
import { useContext, useEffect, useState } from 'react'
import { IconCode, IconFileCode } from '@tabler/icons'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import ModalManager from '../../ui/modal-manager'
import CategoryUpload from './category-upload'

/*
 *  NOTE: Here will be the testing requirements for the category mapper
 *  We will be unit testing both the index.tsx categorymapper component and the form 
 *  generated in the CategoryUpload component.
 * 
 *  CategoryMapper Unit Testing Requirements:
 *      - filename = Upload categories.json
 *      - filetype = .json file
 *  CategoryUpload Unit testing requirements:
 *      - source = Category Definition
 *      - map = Map to Field
 *  
 *  The requirements for E2E will test the flow of uploading a categories.json successfuly using the component
 *  UploadSteps:
 *      1) click on unstyled button in order to open modal
 *      2) check if modal was successfully opened
 *      3) upload a dummy categories.json file
 *      4) check if uploaded
 *      5) upload file
 *      6) check if file_name = the upload file name
 * 
 *  Based on the above requirements, the following locators will be placed within the component
 *  Locators:
 *      1) category-button (this is the unstyled button)
 *      2) file-name (this is the file-name status)
 *      3) file-upload (this is the file-upload form component)
 *      4) dropdown (this is the dropdown form component)
*/

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
                data-testId={"category-button"}
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
                    <div 
                        className={fileStyles.file__name}
                        data-testId={"file-name"}
                    >
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