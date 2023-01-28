import { SetStateAction, useContext, useEffect, useState } from "react"
import { OrganizationContextData } from "../../../data/organization/context"
import { OrganizationDrive } from "../../../data/organization/organization-api"
import { IDriveResp, IOrganizationController } from "../../../data/organization/types"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"
import FileExplorer from "../../../file-explorer/file-explorer"
import { ConvertToFileExplorerData } from "../../../file-explorer/functions"
import { IExplorerFolder, IExplorerItem } from "../../../file-explorer/types"

interface IDriveDataProps {
    setDriveData: (value: SetStateAction<IDriveResp | null>) => void
}

const DriveData: React.FC<IDriveDataProps> = ({ setDriveData }) => {
    const { 
        selectedOrganization,
        activeDirectory,
        updateDrive,
        selectedDriveId,
        setSelectedDriveId,
        setActiveDirectory 
    } = useContext(OrganizationContextData) as IOrganizationController

    const { authData } = useContext(UserContextData) as IUserContext

    //NOTE: State for the drive data
    const [respData, setRespData] = useState<IDriveResp | null>(null)
    const [folders, setFolders] = useState<IExplorerFolder[]>([])
    const [items, setItems] = useState<IExplorerItem[]>([])
    
    async function fetchDrive() {
        if(selectedOrganization === null)
            return
        let token = authData?.token
        if(token === undefined)
            return

        //fetch the drive
        let resp = await OrganizationDrive(token, selectedOrganization)
        setRespData({ ...resp })
        setDriveData({ ...resp })
    }
    
    useEffect(() => {
        fetchDrive()
    }, [selectedOrganization, updateDrive])

    useEffect(() => {
        if(respData === null)
            return
        let data = ConvertToFileExplorerData(respData, activeDirectory)
        if(data === null)
            return

        setFolders([ ...data.folders ])
        setItems([ ...data.items ])
    }, [respData, activeDirectory])

    return (
        <div
            id="drive-background"
            style={{ width: '100%', height: '100%' }}
            onClick={(e) => { 
                if(e.target === e.currentTarget)
                    setSelectedDriveId(null)
            }}
        >
            <FileExplorer 
                folders={folders}
                items={items}
                activeItem={selectedDriveId}
                setActiveItem={setSelectedDriveId}
                setActiveDirectory={setActiveDirectory}
            />
        </div>
    )
}

export default DriveData