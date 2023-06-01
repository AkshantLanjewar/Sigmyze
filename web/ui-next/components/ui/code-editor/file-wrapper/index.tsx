import styles from './index.module.scss'
import { useEffect, useState, MouseEvent, useContext } from 'react'
import { IFile, IFilesystem, IFolder } from '../types'
import FileItem from './file'
import FileTitleBar from './title-bar'
import FolderItem from './folder'
import { CodeEditorContextData } from '..'
import { ICodeEditorState } from '../state'

interface IFileWrapperProps {
    filesystem: IFilesystem | undefined
}

const FileWrapper: React.FC<IFileWrapperProps> = ({ filesystem }) => {
    const [internalFolders, setInternalFolders] = useState<IFolder[]>([])
    const [internalFiles, setInternalFiles] = useState<IFile[]>([])

    const { unselectAll } = useContext(CodeEditorContextData) as ICodeEditorState

    const clear = () => {
        setInternalFiles([])
        setInternalFolders([])
    }

    useEffect(() => {
        clear()
        if(filesystem === undefined)
            return

        let folders = filesystem.folders
        let files = filesystem.files
        if(folders === undefined || files === undefined)
            return

        setInternalFolders([ ...folders ])
        setInternalFiles([ ...files ])
    }, [filesystem])

    const contentClick = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.stopPropagation()
        unselectAll()
    }

    return (
        <>
            <div 
                className={styles.wrapper}
                onClick={(e) => contentClick(e)}
            >
                <FileTitleBar />

                <div className={styles.content}>
                    {internalFolders.map((step) => (
                        <FolderItem folder={step} />
                    ))}

                    {internalFiles.map((step) => (
                        <FileItem file={step} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default FileWrapper