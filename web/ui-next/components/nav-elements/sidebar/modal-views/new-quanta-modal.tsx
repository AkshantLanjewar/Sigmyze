import { IconAtom2 } from "@tabler/icons"
import { useContext } from "react"
import { OrganizationContextData } from "../../../data/organization/context"
import { CreateProject } from "../../../data/organization/drive-api"
import { IOrganizationController } from "../../../data/organization/types"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"
import FormBuilder from "../../../ui/form-builder/form-builder"
import { IQuantaFormField } from "../../../quanta/quanta-editor/types/form"

interface INewQuantaModalProps {
    close: () => void
}

const NewQuantaModal: React.FC<INewQuantaModalProps> = ({ close }) => {
    const { authData } = useContext(UserContextData) as IUserContext
    const { selectedOrganization, toggleDrive, activeDirectory } = useContext(OrganizationContextData) as IOrganizationController
    
    const formFields = [
        {
            type: "text",
            name: "Project Name",
            icon: <IconAtom2 />,
            id: "project_name"
        }
    ] as IQuantaFormField[]
    
    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        let project_name = valStore["project_name"]
        let token = authData?.token
        if(typeof project_name !== "string" || project_name.trim().length === 0)
            return
        if(selectedOrganization === null || token === undefined)
            return

        async function main() {
            await CreateProject(token!, selectedOrganization!, activeDirectory, project_name, "quanta_project")
            toggleDrive()
            close() 
        }

        main()
    }

    return (
        <>
            <FormBuilder
                forms={formFields}
                submit={submit}
                closeModal={close}
            />
        </>
    )
}

export default NewQuantaModal