import { ActionIcon, Group, Tooltip } from "@mantine/core"
import { IconDoorEnter, IconSettings, IconTrash } from "@tabler/icons"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IDriveFolder, IDriveProject } from "../../data/organization/types"
import ModalManager from "../../ui/modal-manager"
import DeleteForm from "./delete-form"
import UpdateForm from "./update-form"

interface IDriveActionMenuProps {
    actionMenu: string | null,
    selectedFolder: IDriveFolder | null,
    selectedProject: IDriveProject | null,
    modalState: string | null,
    setModalState: Dispatch<SetStateAction<string | null>>
}

const DriveActionMenu: React.FC<IDriveActionMenuProps> = 
    ({ actionMenu, selectedFolder, selectedProject, modalState, setModalState }) => {
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [itemId, setItemId] = useState<string | null>(null)
    const [typeId, setTypeId] = useState<string | null>(null)
    const closeModal = () => setModalState(null)

    useEffect(() => {
        if(selectedFolder !== null) {
            let name = selectedFolder.folder_name!

            setType("Folder")
            setName(name)
            setItemId(selectedFolder.folder_id!)
            return
        }

        if(selectedProject !== null) {
            let name = selectedProject.project_name
            let _typeId = selectedProject.project_type
            if(name === undefined || _typeId === undefined)
                return

            setType("Project")
            setName(name)
            setItemId(selectedProject.project_id!)
            setTypeId(_typeId)
            return
        }

        setName("")
        setType("")
        setItemId(null)
        setTypeId(null)
    }, [selectedFolder, selectedProject])

    return (
        <div>
            <ModalManager
                modalState={modalState}
                close={closeModal}
            >
                <ModalManager.Modal
                    title={`${type} Settings`}
                    id={'settings'}
                >
                    <UpdateForm 
                        type={type}
                        name={name}
                        itemId={itemId}
                        typeId={typeId}
                        close={closeModal}
                    />
                </ModalManager.Modal>

                <ModalManager.Modal
                    title={`Delete ${name}`}
                    id={'delete'}
                >
                    <DeleteForm 
                        type={type}
                        name={name}
                        itemId={itemId}
                        typeId={typeId}
                        close={closeModal}
                    />
                </ModalManager.Modal>
            </ModalManager>

            {actionMenu && (
                <Group spacing={"xs"}>
                    {actionMenu === "project" && (
                        <Tooltip
                            openDelay={300}
                            label={'Open'}
                            color={"dark"}
                            position={'bottom'}
                        >
                            <ActionIcon
                                size={"lg"}
                                radius={"xl"}
                            >
                                <IconDoorEnter size={20} />
                            </ActionIcon>
                        </Tooltip>
                    )}

                    <Tooltip
                        openDelay={300}
                        label={'Settings'}
                        color={"dark"}
                        position={'bottom'}
                    >
                        <ActionIcon
                            size={"lg"}
                            radius={"xl"}
                            onClick={() => setModalState("settings")}
                        >
                            <IconSettings size={20} />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip
                        openDelay={300}
                        label={'Remove'}
                        color={"dark"}
                        position={'bottom'}
                    >
                        <ActionIcon
                            size={"lg"}
                            radius={"xl"}
                            onClick={() => setModalState("delete")}
                        >
                            <IconTrash size={20} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            )}
        </div>
    )
}

export default DriveActionMenu