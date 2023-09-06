import { memo, useEffect, useState } from "react"
import { ISigmyzeFile, ISigmyzeFilesystem, ISigmyzeFolder } from "../types"

import styles from './file-tree-view.module.scss'
import FileTreeFolder from "./folder"
import FileTreeFile from "./file"

/**
 * theese are the props needed for the FileTreeView component to function
 */
interface IFileTreeViewProps {
    /**
     * this is the passed filesystem. Since FileTreeView is a purely presentational component,
     * it cannot edit the filesystem in any way. That must be handled outside the component.
     */
    fileSystem: ISigmyzeFilesystem
}

const FileTreeView: React.FC<IFileTreeViewProps> = ({ fileSystem }) => {
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
    
    return (
        <View
            folders={folders}
            files={files}
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
    files: ISigmyzeFile[]
}

const View: React.FC<IViewProps> = memo(({ folders, files }) => (
    <div data-testid={'file-dropdown-container'} className={styles.dropdownContainer}>
        {folders.map((step, index) => (
            <FileTreeFolder 
                folder={step} 
                order={0} 
                index={index} 
            />
        ))}

        {files.map((step, index) => (
            <FileTreeFile
                file={step}
                index={index}
                order={0}
            />
        ))}
    </div>
))

export default FileTreeView