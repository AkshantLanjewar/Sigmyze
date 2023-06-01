import { IconChevronDown, IconFolder } from "@tabler/icons"
import { IFile, IFolder } from "../types"
import styles from './file.module.scss'
import { useEffect, useState, MouseEvent, useContext } from "react"
import FileItem from "./file"
import { Collapse } from "@mantine/core"
import { CodeEditorContextData } from ".."
import { ICodeEditorState } from "../state"

const PADDING_CONSTANT = 24

interface IFolderItemProps {
    folder: IFolder,
    additionalPadding?: number
}

const FolderItem: React.FC<IFolderItemProps> = ({ folder, additionalPadding }) => {
    const [hasChildren, setHasChildren] = useState(false)
    const [opened, setOpened] = useState(true)
    const [active, setActive] = useState(false)

    const [internalFiles, setInternalFiles] = useState<IFile[]>([])
    const [internalFolders, setInternalFolders] = useState<IFolder[]>([])

    const { activeItem, selectDirectory } = useContext(CodeEditorContextData) as ICodeEditorState

    let padding = 0
    if(additionalPadding !== undefined)
        padding = additionalPadding

    useEffect(() => {
        let folderFiles = folder.files ? folder.files : []
        let folderFolders = folder.folders ? folder.folders : []

        if(folderFiles.length > 0 || folderFolders.length > 0)
            setHasChildren(true)

        setInternalFiles([ ...folderFiles ])
        setInternalFolders([ ...folderFolders ])
    }, [folder])

    useEffect(() => {
        setActive(false)
        if(folder.item_id === activeItem)
            setActive(true)
    }, [activeItem])

    const itemClicked = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.stopPropagation()
        setOpened(!opened)

        if(folder.item_id === undefined)
            return
        selectDirectory(folder.item_id)
    }

    return (
        <>
            <div className={`${styles.container} ${active ? styles.active : ''}`}>
                <div 
                    className={styles.inner}
                    onClick={itemClicked}
                    style={{ paddingLeft: `calc(.5em + ${padding}px)` }}
                >
                    <IconChevronDown 
                        size={18} 
                        opacity={hasChildren ? 1 : 0} 
                        style={{
                            transform: `rotate(${opened ? 0 : -90}deg)`,
                            transition: 'all 100ms ease-in-out'
                        }}
                    /> 

                    <IconFolder size={18} fill="#bd9354" fillOpacity={1} color="#bd9354" />

                    <div className={styles.text__container}>
                        {folder.folder_name}
                    </div>
                </div>
            </div>

            <Collapse 
                in={opened}
                className={styles.children__wrapper}
            >
                <div className={styles.children}>
                    {internalFolders.map((step) => (
                        <FolderItem folder={step} additionalPadding={padding + PADDING_CONSTANT} />
                    ))}

                    {internalFiles.map((step) => (
                        <FileItem file={step} additionalPadding={padding + PADDING_CONSTANT} />
                    ))}
                </div>
            </Collapse>
        </>
    )
}

export default FolderItem