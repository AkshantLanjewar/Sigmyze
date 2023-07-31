import { Button, FocusTrap, Group, Input, LoadingOverlay } from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconBox } from "@tabler/icons"
import { FormEvent, useContext, useState } from "react"
import { OrganizationContextData } from "../../../data/organization/context"
import { CreateProject } from "../../../data/organization/drive-api"
import { IOrganizationController } from "../../../data/organization/types"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"

interface INewProjectModalProps {
    close: () => void
}

const NewProjectModal: React.FC<INewProjectModalProps> = ({ close }) => {
    const form = useForm({
        initialValues: {
            name: ''
        },

        validate: {
            name: (val) => val.trim().length === 0 ? "Please type a folder name" : null
        }
    })
    
    const [loading, setLoading] = useState(false)

    const { authData } = useContext(UserContextData) as IUserContext
    const { 
        activeDirectory, 
        selectedOrganization,
        toggleDrive 
    } = useContext(OrganizationContextData) as IOrganizationController

    function createProject(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        async function main() {
            if(selectedOrganization === null)
                return

            let name = form.values.name
            if(name.trim().length === 0)
                return

            let token = authData?.token
            if(token === undefined)
                return

            setLoading(true)
            await CreateProject(token, selectedOrganization, activeDirectory, name, "lunar_project")
            toggleDrive()
            setLoading(false)
            close()
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
                        transitionDuration={0} 
                    />

                    <form onSubmit={createProject}>
                        <Input
                            icon={<IconBox style={{ paddingLeft: 6 }} />}
                            radius={"xl"}
                            variant={"filled"}
                            placeholder={"Project Name"}
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
                            >
                                Create
                            </Button>
                        </Group>
                    </form>
                </div>
            </FocusTrap>
        </div>
    )
}

export default NewProjectModal