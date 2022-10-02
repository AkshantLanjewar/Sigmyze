import React, { useEffect } from 'react'

import { 
    Box,
    Modal 
} from '@mantine/core'

import { useForm }                 from '@mantine/form'
import { capitalize, usePrevious } from '../../../../lib'

const ProjectModal = ({ opened, setOpened, modalState, setModalState }) => {
    const prevOpened = usePrevious(opened)
    const form       = useForm({
        projectName: ''
    })

    function OnSubmit(e) {
        e.preventDefault()
    }

    useEffect(() => {
        if(prevOpened == true && opened == false)
            setModalState("update")
    }, [opened])

    return (
        <Box>
            <Modal
                opened={opened}
                onClose={() => { setOpened(false) }}
                title={`${capitalize(modalState)} Project`}
                centered
            >
                <form onSubmit={OnSubmit}>

                </form>
            </Modal>
        </Box>
    )
}

export default ProjectModal