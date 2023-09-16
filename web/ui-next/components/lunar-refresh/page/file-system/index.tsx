// setFolderOpenState -> context function

import { useContext } from "react"
import { ISigmyzeFilesystem } from "../../../ui/file-management/types"
import { LunarUIContextData } from "../../ui-context"
import { ILunarUIState } from "../../ui-context/state"
import FileTreeView from "../../../ui/file-management/file-tree-view"

interface IFilesystemWrapperProps {
    fileSystem: ISigmyzeFilesystem,
    activeItemId: string | undefined,
    setItemActive: (itemId: string, itemType: string) => void,
    resetActive: () => void
}

const FileSystemWrapper: React.FC<IFilesystemWrapperProps> = ({ fileSystem, activeItemId, setItemActive, resetActive }) => {
    const { setFolderOpenState } = useContext(LunarUIContextData) as ILunarUIState
    
    return (
        <>
            <FileTreeView 
                fileSystem={fileSystem} 
                activeItemId={activeItemId}
                setItemActive={setItemActive}
                resetActive={resetActive}
                setFolderOpenState={setFolderOpenState}
            />
        </>
    )
}

export default FileSystemWrapper