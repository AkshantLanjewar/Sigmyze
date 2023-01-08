import { Button, Group, Modal, TextInput } from "@mantine/core"
import { FormEvent, useRef } from "react"
import { ILunarUIData, createProject } from "../../data/lunar/types"

import { 
    FcFolder,
    FcDocument,
    FcComboChart 
} from 'react-icons/fc'

interface IExplorerModalProps {
    ui: ILunarUIData,
    modalState: string | undefined | null,
    close: () => void,
    createProject: createProject
}

interface IModalTemplateProps {
    id: string,
    title: string,
    modalState: string | undefined | null,
    children: JSX.Element
    close: () => void,
    onSubmit: (e: FormEvent<HTMLFormElement>, type: string) => void
}

const ModalTemplate: React.FC<IModalTemplateProps> = ({ id, title, modalState, children, close, onSubmit }) => {
    return (
        <Modal
            opened={modalState === id}
            centered
            onClose={() => { close() }}
            overlayOpacity={0.55}
            overlayBlur={3}
            sx={(theme) => ({ 
                body: {
                    backgroundColor: theme.colors.dark[8]
                } 
            })}
            title={title}
        >
            <form onSubmit={(e) => { onSubmit(e, id) }}>
                {children}

                <Group position="center" mt={"md"}>
                    <Button
                        color={"indigo"}
                        type={"submit"}
                    >
                        Create
                    </Button>
                </Group>
            </form>
        </Modal>
    )
}

const ExplorerModal: React.FC<IExplorerModalProps> = ({ ui, modalState, close, createProject }) => {
    const folderRef   = useRef<HTMLInputElement>(null)
    const documentRef = useRef<HTMLInputElement>(null)
    const chartRef    = useRef<HTMLInputElement>(null)

    function onSubmit(e: FormEvent<HTMLFormElement>, type: string) {
        e.preventDefault()
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

        const ui_id = ui.active_id

        createProject(ui_id, value, type)
        close()
    }

    return (
        <div>
            <ModalTemplate
                id={"folder"} 
                title={"Create Folder"}
                modalState={modalState}
                close={close}
                onSubmit={onSubmit}
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
                id={"document"}
                title={"Create Document"}
                modalState={modalState}
                close={close}
                onSubmit={onSubmit}
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
            >
                <TextInput
                    label="Document Name"
                    placeholder="Document Name"
                    variant="filled"
                    data-autofocus
                    icon={<FcComboChart size={22} />}
                    ref={documentRef}
                />
            </ModalTemplate>
        </div>
    )
}

export default ExplorerModal