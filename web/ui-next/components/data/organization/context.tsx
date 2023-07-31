import { createContext, useContext, useEffect, useState } from "react"
import { UserContextData } from "../user/context"
import { IUserContext } from "../user/types"
import { GetOrganizations } from "./functions"
import { IOrganization, IOrganizationController } from "./types"

const OrganizationContextData = createContext<IOrganizationController | null>(null)

interface IOrganizationContextProps {
    children: React.ReactNode
}

const OrganizationContext: React.FC<IOrganizationContextProps> = ({ children }) => {
    //NOTE: Theese are the useState's in relation to the organization
    const [organizations, setOrganizations] = useState<IOrganization[]>([])
    const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null)
    const [activeDirectory, setActiveDirectory] = useState("root")
    const [updateDrive, setUpdateDrive] = useState(false)

    //NOTE: this handles the managment of the file-explorer ui
    const [selectedDriveId, setSelectedDriveId] = useState<string | null>(null)

    const { loggedIn, authData, logout } = useContext(UserContextData) as IUserContext

    //FEATURE: Reset the state options
    function reset() {
        setActiveDirectory("root")
        setOrganizations([])
        setSelectedOrganization(null)
    }

    //NOTE: Effect hooks

    //FEATURE: This hook grabs data relating to the users organizations when they become logged in
    useEffect(() => {
        if(loggedIn === false)
            reset()
        if(loggedIn !== true)
            return
        let token = authData?.token
        if(token === undefined)
            return

        async function main() {
            if(logout === undefined)
                return

            try {
                await GetOrganizations(token!, setOrganizations)
            } catch(e) {
                await logout(token!)
            }
        }

        main()
    }, [authData])

    useEffect(() => {
        if(organizations.length === 0)
            return
        
        setOrganization(organizations[0].organization_id)
    }, [organizations])

    //FEATURE: Function to set an active organization
    function setOrganization(id: string) {
        setSelectedOrganization(id)
    }

    //FEATURE: Toggle a drive update
    function toggleDriveUpdate() {
        setUpdateDrive(!updateDrive)
    }

    //build the context
    let contextValue = {} as IOrganizationController
    //NOTE: Theese are the data values within the context
    contextValue.organizations = organizations
    contextValue.selectedOrganization = selectedOrganization
    contextValue.activeDirectory = activeDirectory
    contextValue.updateDrive = updateDrive

    //NOTE: drive ui state
    contextValue.selectedDriveId = selectedDriveId
    contextValue.setActiveDirectory = setActiveDirectory

    contextValue.setOrganization = setOrganization
    contextValue.toggleDrive = toggleDriveUpdate
    contextValue.setSelectedDriveId = setSelectedDriveId

    return (
        <>
            <OrganizationContextData.Provider value={contextValue}>
                <div style={{ width: '100%', height: '100%' }}>
                    {children}
                </div>
            </OrganizationContextData.Provider>
        </>
    )
}

export { OrganizationContextData }
export default OrganizationContext