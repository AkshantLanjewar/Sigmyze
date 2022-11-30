import React, { useEffect } from 'react'

import { 
    Box,
    Modal 
} from '@mantine/core'

import { capitalize } from '../../../../../../components/lib'

import UpdateForm from '../../modal-forms/update-form'
import DeleteForm from '../../modal-forms/delete-form'

const ProjectModal = ({ opened, setOpened, modalState, id, title }) => {
    function OnSubmit(e) {
        e.preventDefault()
    }

    useEffect(() => {
        
    }, [opened])

    return (
        <Box>
            <Modal
                opened={opened}
                onClose={() => { setOpened(false) }}
                title={`${capitalize(modalState)} Project`}
                centered
            >
                {modalState == "update" && (
                    <UpdateForm
                        id={id}
                        title={title}
                        setOpened={setOpened}
                    />
                )}

                {modalState == "delete" && (
                    <DeleteForm 
                        id={id} 
                        title={title}
                        setOpened={setOpened}
                    />
                )}
            </Modal>
        </Box>
    )
}

export default ProjectModal