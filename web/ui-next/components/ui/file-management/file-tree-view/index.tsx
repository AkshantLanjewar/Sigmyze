import { memo, useCallback, useEffect, useState } from "react"
import { ISigmyzeFile, ISigmyzeFilesystem, ISigmyzeFolder } from "../types"

import styles from './file-tree-view.module.scss'
import FileTreeFolder from "./folder"
import FileTreeFile from "./file"
import { v4 } from "uuid"

/**
 * theese are the props needed for the FileTreeView component to function
 */
interface IFileTreeViewProps {
    /**
     * this is the passed filesystem. Since FileTreeView is a purely presentational component,
     * it cannot edit the filesystem in any way. That must be handled outside the component.
     */
    fileSystem: ISigmyzeFilesystem,

    /**
     * this is the id of the active item within the filesystem. it is controlled externally.
     * If set to a value, the node with the matching ID will be highlighted within the file tree editor
     */
    activeItemId: string | undefined,

    /**
     * this is the function passed to the file tree that can set the active item within the file tree
     * @param itemId 
     *  this is the id of the item we want to be set active
     * @param itemType 
     *  this is the type of object being set active, so other parameters, such as portal buttons and active folder may be correctly set as well
     */
    setItemActive?: (itemId: string, itemType: string) => void,

    /**
     * this is the function that resets the active item to the root project folder
     */
    resetActive?: () => void,

    /**
     * this is the function that helps folders persist their open / close state to memory
     * @param folderId 
     *  this is the id of the folder of who's state we are trying to persist
     * @param openState 
     *  this is the open state of the folder, wether it is opened or not
     */
    setFolderOpenState?: (folderId: string, openState: boolean) => void,

    /**
     * @description
     *  - this is the function that opens a new tab within the viewport
     * @param fileId 
     *  - this is the id of the file we want to open in the viewport
     */
    openTab: (fileId: string) => void
}

const FileTreeView: React.FC<IFileTreeViewProps> = ({ 
    fileSystem,
    activeItemId,
    setItemActive,
    resetActive,
    setFolderOpenState,
    openTab 
}) => {
    //theese are the root level folders in the filesystem
    const [folders, setFolders] = useState<ISigmyzeFolder[]>([])
    //theese are the root level files within the filesystem
    const [files, setFiles] = useState<ISigmyzeFile[]>([])

    /**
     * this effect loads the root level data into the state whenever the filesystem object changes
     */
    useEffect(() => {
        setFolders([ ...fileSystem.folders ])
        setFiles([ ...fileSystem.files ])
    }, [fileSystem])

    //internal methods for the file tree

    /**
     * this is the internal handler for the setFolderOpenState function
     * it only calls the function if it is passed to the component, otherwise the open state is not persisted. 
     */
    const setFolderOpenStateCallback = useCallback((folderId: string, openState: boolean) => {
        if(setFolderOpenState === undefined)
            return

        setFolderOpenState(folderId, openState)
    }, [setFolderOpenState])
    
    return (
        <View
            folders={folders}
            files={files}
            activeItemId={activeItemId}
            setItemActive={setItemActive}
            setFolderOpenStateCallback={setFolderOpenStateCallback}
            openTab={openTab}
        />
    )
}

/**
 * theese are the props in order for the view component to function
 */
interface IViewProps {
    /**
     * theese are the root level folders within the filesystem
     */
    folders: ISigmyzeFolder[]

    /**
     * theese are the root level files within the filesystem
     */
    files: ISigmyzeFile[],

    /**
     * this is the id of the active item within the filesystem. it is controlled externally.
     * If set to a value, the node with the matching ID will be highlighted within the file tree editor
     */
    activeItemId: string | undefined,

    /**
     * this is the function passed to the file tree that can set the active item within the file tree
     * @param itemId 
     *  this is the id of the item we want to be set active
     * @param itemType 
     *  this is the type of object being set active, so other parameters, such as portal buttons and active folder may be correctly set as well
     */
    setItemActive?: (itemId: string, itemType: string) => void,

    /**
     * this is the function that helps folders persist their open / close state to memory
     * @param folderId 
     *  this is the id of the folder of who's state we are trying to persist
     * @param openState 
     *  this is the open state of the folder, wether it is opened or not
     */
    setFolderOpenStateCallback: (folderId: string, openState: boolean) => void,

    /**
     * @description
     *  - this is the function that opens a new tab within the viewport
     * @param fileId 
     *  - this is the id of the file we want to open in the viewport
     */
    openTab: (fileId: string) => void    
}

const View: React.FC<IViewProps> = memo(({ folders, files, activeItemId, setItemActive, setFolderOpenStateCallback, openTab }) => (
    <div data-testid={'file-dropdown-container'} className={styles.dropdownContainer}>
        {folders.map((step, index) => (
            <FileTreeFolder 
                folder={step} 
                subFolders={step.folders}
                order={0} 
                index={index}
                activeItemId={activeItemId} 
                setItemActive={setItemActive}
                key={`${step.folderId}-${step.folders.length}-${step.files.length}`}
                setFolderOpenState={setFolderOpenStateCallback}
                openTab={openTab}
            />
        ))}

        {files.map((step, index) => (
            <FileTreeFile
                file={step}
                index={index}
                order={0}
                activeItemId={activeItemId}
                setItemActive={setItemActive}
                key={step.fileId}
                openTab={openTab}
            />
        ))}
    </div>
))

export default FileTreeView