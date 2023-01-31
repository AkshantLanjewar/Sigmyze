import { Button, Group, Modal, TextInput, Alert, Switch } from "@mantine/core"
import { FormEvent, useContext, useRef, useState } from "react"
import { ILunarState } from "../../data/lunar/types/types"

import { AiOutlineWarning } from 'react-icons/ai'
import { 
    FcFolder,
    FcDocument,
    FcComboChart 
} from 'react-icons/fc'
import AddIndicatorModal, { IAddIndicatorData } from "./add-indicator"
import { LunarContextData } from "../../data/lunar/context"

interface IModalTemplateProps {
    id: string,
    title: string,
    modalState: string | undefined | null,
    submitBtn: string,
    children: JSX.Element,
    warning?: JSX.Element,
    close: () => void,
    onSubmit: (e: FormEvent<HTMLFormElement>, type: string) => void
}

const ModalTemplate: React.FC<IModalTemplateProps> 
    = ({ id, title, modalState, children, warning, close, onSubmit, submitBtn }) => {
    const [checked, setChecked] = useState(warning ? false : true)
    
    return (
        <Modal
            opened={modalState === id}
            centered
            onClose={() => { close() }}
            overlayOpacity={0.55}
            overlayBlur={3}
            exitTransitionDuration={200}
            sx={(theme) => ({ 
                body: {
                    backgroundColor: theme.colors.dark[8]
                } 
            })}
            title={title}
        >
            { warning }

            <form onSubmit={(e) => { onSubmit(e, id) }}>
                {children}

                {warning
                    ? (
                        <Switch
                            mt={"md"}
                            checked={checked}
                            onChange={(e) => { setChecked(e.currentTarget.checked) }}
                            label={`I Agree to delete this ${id.split("_")[0]}`}
                            color={"indigo"}
                        />
                    )
                    : null
                }

                <Group position="center" mt={"md"}>
                    <Button
                        color={"indigo"}
                        type={"submit"}
                        disabled={!checked}
                    >
                        {submitBtn}
                    </Button>
                </Group>
            </form>
        </Modal>
    )
}

interface IModalWarningProps {
    icon: JSX.Element,
    title: string,
    description: string
}

const ModalWarning: React.FC<IModalWarningProps> = ({ icon, title, description }): JSX.Element => {
    return (
        <div>
            <Alert
                icon={icon}
                title={title}
                color={"yellow"}
            >
                {description}
            </Alert>
        </div>
    )
}

interface IExplorerModalProps {
    modalState: string | undefined | null,
    close: () => void,
    pkg: IAddIndicatorData
}

const ExplorerModal: React.FC<IExplorerModalProps> = ({ modalState, close, pkg }) => {
    const folderRef   = useRef<HTMLInputElement>(null)
    const documentRef = useRef<HTMLInputElement>(null)
    const chartRef    = useRef<HTMLInputElement>(null)

    const { 
        createProject, 
        deleteProject,
        setActiveItem,
        toggleDriveUpdate,
        ui,
        idExists,
        data
    } = useContext(LunarContextData) as ILunarState 

    function onSubmit(e: FormEvent<HTMLFormElement>, type: string) {
        e.preventDefault()
        if(ui === null || ui === undefined)
            return
        if(data === null || data === undefined)
            return

        let value = ""
        switch(type) {
            case "folder":
                value = folderRef.current!.value
                break
            case "document":
                value = documentRef.current!.value
                break
            case "chart":
                value = chartRef.current!.value
                break
            default:
                return
        }

        let ui_id = ui.active_id
        //check if the id exists
        let exists = idExists(ui_id)
        if(exists === false) {
            ui_id = data.splits[0].node_id
            setActiveItem(ui_id, data.splits[0].node_type)
        }

        createProject(ui_id, value, type)
        close()
        toggleDriveUpdate()
    }

    function onSubmitDelete(e: FormEvent<HTMLFormElement>, type: string) {
        e.preventDefault()
        if(ui === null || ui === undefined)
            return

        deleteProject(ui.visual_id, ui.visual_type)
        close()
        toggleDriveUpdate()
    }

    return (
        <div>
            <AddIndicatorModal
                modalState={modalState}
                close={close}
                data={pkg}
            />

            <ModalTemplate
                id={"folder"} 
                title={"Create Folder"}
                modalState={modalState}
                close={close}
                onSubmit={onSubmit}
                submitBtn={"Create"}
            >
                <TextInput
                    label="Folder Name"
                    placeholder="Folder Name"
                    variant="filled"
                    data-autofocus
                    icon={<FcFolder size={22} />}
                    ref={folderRef}
                />
            </ModalTemplate>

            <ModalTemplate
                id="folder_delete"
                title={"Delete Folder"}
                modalState={modalState}
                close={close}
                onSubmit={onSubmitDelete}
                submitBtn={"Delete"}
                warning={(
                    <ModalWarning 
                        icon={<AiOutlineWarning size={16} />}
                        title={"Permanent Action"}
                        description={`Deleting this folder is a permanent action. 
                        There is no way to undo or recover the data deleted.`}
                    />
                )}
            >
                <div>

                </div>
            </ModalTemplate>

            <ModalTemplate
                id="chart_delete"
                title={"Delete Chart"}
                modalState={modalState}
                close={close}
                onSubmit={onSubmitDelete}
                submitBtn={"Delete"}
                warning={(
                    <ModalWarning 
                        icon={<AiOutlineWarning size={16} />}
                        title={"Permanent Action"}
                        description={`Deleting this chart is a permanent action. 
                        There is no way to undo or recover the data deleted.`}
                    />
                )}
            >
                <div></div>
            </ModalTemplate>

            <ModalTemplate
                id="document_delete"
                title={"Delete Document"}
                modalState={modalState}
                close={close}
                onSubmit={onSubmitDelete}
                submitBtn={"Delete"}
                warning={(
                    <ModalWarning 
                        icon={<AiOutlineWarning size={16} />}
                        title={"Permanent Action"}
                        description={`Deleting this document is a permanent action. 
                        There is no way to undo or recover the data deleted.`}
                    />
                )}
            >
                <div></div>
            </ModalTemplate>

            <ModalTemplate
                id={"document"}
                title={"Create Document"}
                modalState={modalState}
                close={close}
                onSubmit={onSubmit}
                submitBtn={"Create"}
            >
                <TextInput
                    label="Document Name"
                    placeholder="Document Name"
                    variant="filled"
                    data-autofocus
                    icon={<FcDocument size={22} />}
                    ref={documentRef}
                />
            </ModalTemplate>

            <ModalTemplate
                id={"chart"}
                title={"Create Chart"}
                modalState={modalState}
                close={close}
                onSubmit={onSubmit}
                submitBtn={"Create"}
            >
                <TextInput
                    label="Document Name"
                    placeholder="Document Name"
                    variant="filled"
                    data-autofocus
                    icon={<FcComboChart size={22} />}
                    ref={chartRef}
                />
            </ModalTemplate>
        </div>
    )
}

export default ExplorerModal