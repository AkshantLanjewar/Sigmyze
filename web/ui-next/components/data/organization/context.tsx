import { createContext } from "react"
import { IOrganizationController } from "./types"

const OrganizationContextData = createContext<IOrganizationController | null>(null)

interface IOrganizationContextProps {
    children: React.ReactNode
}

const OrganizationContext: React.FC<IOrganizationContextProps> = ({ children }) => {
    //build the context
    let contextValue = {} as IOrganizationController

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

export default OrganizationContext