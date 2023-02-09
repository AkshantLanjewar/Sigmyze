import { Button, FocusTrap, Group, LoadingOverlay, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { IconFolder, IconBox } from "@tabler/icons"
import { FormEvent, useContext, useState } from "react"
import { OrganizationContextData } from "../../data/organization/context"
import { UpdateFolder, UpdateProject } from "../../data/organization/drive-api"
import { IOrganizationController } from "../../data/organization/types"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"

interface IUpdateFormProps {
    type: string,
    name: string,
    itemId: string | null,
    close: () => void
}

const UpdateForm: React.FC<IUpdateFormProps> = ({ type, name, itemId, close }) => {
    const form = useForm({
        initialValues: {
            name: name
        },
    })

    const [loading, setLoading] = useState(false)

    const { authData } = useContext(UserContextData) as IUserContext
    const { 
        activeDirectory, 
        selectedOrganization,
        toggleDrive 
    } = useContext(OrganizationContextData) as IOrganizationController

    let icon = <IconFolder style={{ paddingLeft: 6 }} />
    if(type === "Project")
        icon = <IconBox style={{ paddingLeft: 6 }} />

    function updateForm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        let name = form.values.name.trim()
        if(name.length === 0) {
            showNotification({
                title: "Drive Error",
                message: `The name of your ${type.toLowerCase()} cannot be empty`,
                color: 'red',
                autoClose: 1000 * 10
            })
            return
        }

        async function main() {
            let token = authData?.token
            if(token === undefined)
                return
            if(selectedOrganization === null)
                return
            if(itemId === null)
                return

            if(type === "Project") {
                setLoading(true)
                await UpdateProject(token, selectedOrganization, activeDirectory, itemId, name)
                toggleDrive()
                setLoading(false)
                close()

                return
            }

            if(type === "Folder") {
                setLoading(true)
                await UpdateFolder(token, selectedOrganization, activeDirectory, itemId, name)
                toggleDrive()
                setLoading(false)
                close()

                return
            }
        }

        main()
    }
    
    return (
        <div>
            <FocusTrap>
                <div style={{ position: 'relative' }}>
                    <LoadingOverlay
                        visible={loading}
                        overlayBlur={2}
                        transitionDuration={150}
                    />

                    <form onSubmit={updateForm}>
                        <TextInput
                            icon={icon}
                            radius={"xl"}
                            variant={"filled"}
                            label={`${type} Name`}
                            placeholder={`${type} Name`}
                            {...form.getInputProps('name')}
                            data-autofocus 
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
                                disabled={form.values.name.trim().length === 0}
                            >
                                Update
                            </Button>
                        </Group>
                    </form>
                </div>
            </FocusTrap>
        </div>
    )
}

export default UpdateForm