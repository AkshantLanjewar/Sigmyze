import { memo } from "react";
import { IQuantaFormField } from "../../types/form"
import styles from '../node-renderer.module.scss'
import ModalManager from "../../../../ui/modal-manager";
import FormBuilder from "../../../../ui/form-builder/form-builder";
import { Motion, spring } from "react-motion";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons";

interface IViewProps {
    modalState: string | null,
    formFields: IQuantaFormField[],
    defaultValues: { [key: string]: any; } | undefined,  
    internalFocused: boolean,
    deleteField: () => void,
    openEditName: () => void,
    closeModal: () => void,
    submit: (forms: IQuantaFormField[], valStore: {
        [key: string]: any;
    }) => void,
        
}

const DatasetFieldActionsView: React.FC<IViewProps> = memo(({
    modalState,
    formFields,
    defaultValues,
    internalFocused,
    deleteField,
    openEditName,
    closeModal,
    submit
}) => {
    return (
        <>
            <ModalManager
                modalState={modalState}
                close={closeModal}
            >
                <ModalManager.Modal
                    id="edit_name"
                    title="Edit Field Name"
                >
                    <FormBuilder
                        forms={formFields}
                        submit={submit}
                        closeModal={closeModal}
                        defaultValue={defaultValues}
                    />
                </ModalManager.Modal>
            </ModalManager>

            <Motion style={{ x: spring(internalFocused ? -95 : 0), opacity: spring(internalFocused ? 1 : 0) }}>
                {({ x, opacity }) => (
                    <div className={styles.node__add} style={{ left: x, opacity: opacity }}>
                        <Tooltip
                            withArrow
                            color={"dark"}
                            label={"Delete Field"}
                            styles={{ tooltip: { backgroundColor: "#08090A" } }}
                            openDelay={250}
                            transition={"slide-down"}
                            position={"top"}
                        >
                            <ActionIcon
                                color={"red"}
                                variant={"light"}
                                radius={"sm"}
                                onClick={() => deleteField()}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip
                            withArrow
                            color={"dark"}
                            label={"Edit Name"}
                            styles={{ tooltip: { backgroundColor: "#08090A" } }}
                            openDelay={250}
                            transition={"slide-down"}
                            position={"top"}
                        >
                            <ActionIcon
                                color={"cyan"}
                                variant={"light"}
                                radius={"sm"}
                                onClick={() => openEditName()}
                            >
                                <IconPencil size={18} />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                )}
            </Motion>
        </>
    )
})

export default DatasetFieldActionsView