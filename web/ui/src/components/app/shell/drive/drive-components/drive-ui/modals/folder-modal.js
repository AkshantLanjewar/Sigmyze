import React from 'react'

import { 
    Box,
    Modal 
} from '@mantine/core'

import { capitalize } from '../../../../../../lib'

import UpdateForm from './folder-update-form'

const FolderModal = ({ opened, setOpened, modalState, id, title, GetFolderData }) => {
    return (
        <Box>
            <Modal
                opened={opened}
                onClose={() => { setOpened(false) }}
                title={`${capitalize(modalState)} Folder`}
                centered
            >
                {modalState == "update" && (
                    <UpdateForm
                        id={id}
                        title={title}
                        GetFolderData={GetFolderData}
                        setOpened={setOpened}
                    />
                )}
            </Modal>
        </Box>
    )
}

export default FolderModal