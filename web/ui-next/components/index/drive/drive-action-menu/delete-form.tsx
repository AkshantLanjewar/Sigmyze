import { Alert, Button, FocusTrap, Group, Input, LoadingOverlay } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { IconAlertCircle, IconBox, IconFolder } from "@tabler/icons"
import { FormEvent, useContext, useState } from "react"
import { OrganizationContextData } from "../../../data/organization/context"
import { DeleteFolder, DeleteProject } from "../../../data/organization/drive-api"
import { IOrganizationController } from "../../../data/organization/types"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"

interface IDeleteFormProps {
    type: string,
    name: string,
    itemId: string | null,
    close: () => void
}

const DeleteForm: React.FC<IDeleteFormProps> = ({ type, name, itemId, close }) => {
    const form = useForm({
        initialValues: {
            name: ''
        },
    })

    const [loading, setLoading] = useState(false)

    const { authData } = useContext(UserContextData) as IUserContext
    const { 
        activeDirectory, 
        selectedOrganization,
        toggleDrive 
    } = useContext(OrganizationContextData) as IOrganizationController

    function deleteForm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if(form.values.name !== name)
            return

        async function main() {
            let token = authData?.token
            if(token === undefined)
                return
            if(selectedOrganization === null)
                return
            if(itemId === null)
                return

            let formName = form.values.name.trim()
            if(formName !== name)
            {
                showNotification({
                    title: "Drive Error",
                    message: `The name you typed does not match the ${type.toLowerCase()}'s name. Please retype the projects name exactly`,
                    color: 'red',
                    autoClose: 1000 * 10
                })
                
                return
            }

            if(type === "Project") {
                setLoading(true)
                await DeleteProject(token, selectedOrganization, activeDirectory, itemId)
                toggleDrive()
                setLoading(false)
                close()

                return
            }

            if(type === "Folder") {
                setLoading(true)
                await DeleteFolder(token, selectedOrganization, activeDirectory, itemId)
                toggleDrive()
                setLoading(false)
                close()

                return
            }
        }

        main()
    }
    
    let icon = <IconFolder style={{ paddingLeft: 6 }} />
    if(type === "Project")
        icon = <IconBox style={{ paddingLeft: 6 }} />

    return (
        <div>
            <FocusTrap>
                <div style={{ position: 'relative' }}>
                    <LoadingOverlay
                        visible={loading}
                        overlayBlur={2}
                        transitionDuration={150}
                    />

                    <form onSubmit={deleteForm}>
                        <Alert 
                            icon={<IconAlertCircle size={16} />}
                            title={"Important!"}
                            color={"red"}
                        >
                            You are attempting to delete the {type.toLowerCase()} <b>{name}</b>
                            , which is a <b>permanent</b> action. Please type out the name
                            below to delete the {type.toLowerCase()}.
                        </Alert>

                        <Input
                            icon={icon}
                            radius={"xl"}
                            variant={"filled"}
                            placeholder={`${type} Name`}
                            {...form.getInputProps('name')}
                            data-autofocus 
                            mt={'md'}
                        />

                        <Group position={'right'} mt={'md'}>
                            <Button
                                variant={'subtle'}
                                color={'red'}
                                size={'xs'}
                                px={'xs'}
                                onClick={() => { close() }}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant={'subtle'}
                                color={'indigo'}
                                size={'xs'}
                                px={'xs'}
                                type={'submit'}
                                disabled={form.values.name !== name}
                            >
                                Delete
                            </Button>
                        </Group>
                    </form>
                </div>
            </FocusTrap>
        </div>
    )
}

export default DeleteForm