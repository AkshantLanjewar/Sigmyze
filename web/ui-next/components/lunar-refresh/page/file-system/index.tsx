// setFolderOpenState -> context function

import { useCallback, useContext } from "react"
import { ISigmyzeFilesystem } from "../../../ui/file-management/types"
import { LunarUIContextData } from "../../ui-context"
import { ILunarUIState } from "../../ui-context/state"
import FileTreeView from "../../../ui/file-management/file-tree-view"
import { LunarDataManagerData } from "../../data-manager"
import { ILunarDataManagerState } from "../../data-manager/state"

/**
 * Theese are all the props required for the filesystem wrapper to work
 */
interface IFilesystemWrapperProps {
    /**
     * this is the filesystem that will be rendered
     */
    fileSystem: ISigmyzeFilesystem,

    /**
     * this is the itemId of the active item within the filesystem
     */
    activeItemId: string | undefined,

    /**
     * @description
     *  - this is the function that handles the changing of the active item within the filetree
     * @param itemId 
     *  - this is the id of the new active item
     * @param itemType 
     *  - this is the type of the new item.
     *  - NOTE: This field is used to update the side portal buttons
     */
    setItemActive: (itemId: string, itemType: string) => void,

    /**
     * @description
     *  - this is the function that resets the activeId to the root folder in the filesystem
     */
    resetActive: () => void,

    /**
     * @description
     *  - this is the function passed to the file tree which can set the active set of portal buttons
     * @param portalId 
     *  - this is the type of portal buttons we want to be rendered
     * @param itemId 
     *  - this is the id of the item being requested NOTE: only needed for folders
     */
    assignPortalButtons: (portalId: string, itemId: string) => void
}

const FileSystemWrapper: React.FC<IFilesystemWrapperProps> = ({ 
    fileSystem, 
    activeItemId, 
    setItemActive, 
    resetActive,
    assignPortalButtons 
}) => {
    const { setFolderOpenState, openTab } = useContext(LunarUIContextData) as ILunarUIState
    const { setEventIndicator } = useContext(LunarDataManagerData) as ILunarDataManagerState
    
    const openTabCallback = useCallback((fileId: string) =>  {
        openTab(fileId)
    }, [openTab])

    return (
        <>
            <FileTreeView 
                fileSystem={fileSystem} 
                activeItemId={activeItemId}
                setItemActive={setItemActive}
                resetActive={resetActive}
                setFolderOpenState={setFolderOpenState}
                openTab={openTabCallback}
                assignPortalButtons={assignPortalButtons}
                setEventIndicator={setEventIndicator}
            />
        </>
    )
}

export default FileSystemWrapper