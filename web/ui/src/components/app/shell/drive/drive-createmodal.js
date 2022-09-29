import React, { useState, useEffect } from 'react'

import { Modal } from '@mantine/core'

import { connect }     from 'react-redux'
import { usePrevious, capitalize } from '../../../lib'

import { CloseCreateModal } from '../../../../data/actions/driveActions'

import FolderForm  from './modal-forms/folder-form'
import ProjectForm from './modal-forms/project-form'

const DriveCreateModal = ({ drive, closeCreateModal }) => {
    const [opened, setOpened] = useState(false)
    const prevModal           = usePrevious(false)

    let proj_type = drive.create_type

    useEffect(() => {
        setOpened(drive.create_modal)
    }, [drive.create_modal])

    function CloseModal() {
        setOpened(false)
        closeCreateModal()
    }

    return (
        <div>
            <Modal
                opened={opened}
                onClose={() => { CloseModal() }}
                title={`Create ${capitalize(proj_type)}`}
                centered
            >
                {proj_type == "folder" && (
                    <FolderForm 
                        CloseModal={CloseModal}
                    />
                )}

                {proj_type == "project" && (
                    <ProjectForm 
                        CloseModal={CloseModal}
                    />
                )}
            </Modal>
        </div>
    )
}

const mapStateToProps = state => ({
    drive: state.drive
})

const mapDispatchToProps = dispatch => ({
    closeCreateModal: () => { dispatch(CloseCreateModal()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DriveCreateModal)