import { memo, useCallback, useEffect, useState } from "react"
import { ISigmyzeFile, ISigmyzeFolder } from "../types"

import styles from './file-tree-view.module.scss'
import { IconChevronDown, IconFolder } from "@tabler/icons"
import { Collapse, UnstyledButton } from "@mantine/core"
import FileTreeFile from "./file"

const BASE_PADDING = 15
const PADDING_INCREMENT = 23

/**
 * theese are all the required and optional props needed for the FileTreeFolder Component
 */
interface IFileTreeFolderProps {
    /**
     * this is the raw folder data passed to the component
     */
    folder: ISigmyzeFolder,

    /**
     * this is the order of the folder. this effectively controls the level of padding applied
     * to the folder
     */
    order: number,

    /**
     * NOTE: This prop is used only for debugging.
     * this is the index of the folder in the list of rendered folders
     */
    index: number,

    /**
     * NOTE: this prop is only used for debugging.
     * this is whether or not the folder is a child or in the root directory of the filesystem
     */
    isChild?: boolean
}

/**
 * NOTE: This component should only be used within the context of the FileTreeView component.
 * This component renders a folder, and any children a folder may have within it.
 */
const FileTreeFolder: React.FC<IFileTreeFolderProps> = ({ folder, order, index, isChild }) => {
    //theese are the child components of the folder
    const [folders, setFolders] = useState<ISigmyzeFolder[]>([])
    const [files, setFiles] = useState<ISigmyzeFile[]>([])
    //this is related to how indented the display is
    const [paddingLeft, setPaddingLeft] = useState(0)
    //whether or not the folder has children
    const [hasChildren, setHasChildren] = useState(false)
    //whether or not you can see the children
    const [opened, setOpened] = useState(false)
    //whether or not to append the child to its testId locator
    const [appendChild, setAppendChild] = useState(false)

    /**
     * this effect makes sure that the folder is opened if the openMount option is set to true
     */
    useEffect(() => {
        if(folder.openMount === undefined)
            return

        setOpened(folder.openMount)
    }, [])

    /**
     * this folder checks and sets the internal state for whether or not if the folder is a child
     */
    useEffect(() => {
        if(isChild === undefined)
            return

        setAppendChild(isChild)
    }, [isChild])

    /**
     * this effect sets 3 state values with data from the folder prop
     *  - it sets the child folders
     *  - it sets the child files
     *  - it sets whether or not the folder has children
     */
    useEffect(() => {
        let newHasChildren = false
        if(folder.folders.length > 0 || folder.files.length > 0)
            newHasChildren = true

        setFolders([ ...folder.folders ])
        setFiles([ ...folder.files ])
        setHasChildren(newHasChildren)
    }, [folder])

    /**
     * this effect computes the amount of padding that needs to be added, based on the order prop
     */
    useEffect(() => {
        let computedPadding = BASE_PADDING
        computedPadding = computedPadding + (order * PADDING_INCREMENT)

        setPaddingLeft(computedPadding)
    }, [order])

    /**
     * this function handles when the folder is clicked on, so as to toggle the 
     * folder open / close state
     */
    const onClickHandler = useCallback(() => {
        setOpened(!opened)
    }, [opened])

    return (
        <View
            index={index}
            order={order}
            appendChild={appendChild}
            paddingLeft={paddingLeft}
            hasChildren={hasChildren}
            opened={opened}
            folder={folder}
            files={files}
            folders={folders}
            onClickHandler={onClickHandler}
        />
    )
}

/**
 * theese are all the props required for the view component
 */
interface IViewProps {
    /**
     * NOTE: This prop is for debugging only, the index of the folder 
     */
    index: number,

    /**
     * This prop controls the level of indentation the folder receives
     */
    order: number,

    /**
     * NOTE: This prop is only for debugging.
     * This is whether or not this folder is the child of another folder.
     */
    appendChild: boolean,

    /**
     * the raw amount of px's of paddingLeft we want to add
     */
    paddingLeft: number,

    /**
     * whether or not the folder has children
     */
    hasChildren: boolean,

    /**
     * whether or not the folder is opened
     */
    opened: boolean,

    /**
     * the raw folder data
     */
    folder: ISigmyzeFolder,

    /**
     * the child files of the folder
     */
    files: ISigmyzeFile[]

    /**
     * the child folders of the folder
     */
    folders: ISigmyzeFolder[],

    /**
     * function that is called whenever you click on the folder
     */
    onClickHandler: () => void
}

const View: React.FC<IViewProps> = memo(({
    index,
    order,
    appendChild,
    paddingLeft,
    hasChildren,
    opened,
    folder,
    files,
    folders,
    onClickHandler
}) => (
    <div
        data-testId={`container-folder-${index}${appendChild ? "::child" : ""}`} 
        data-testValue={'element-folder'}
    >
        <UnstyledButton 
            className={styles.element}
            style={{ paddingLeft: `${paddingLeft}px` }}
            onClick={() => onClickHandler()}
        >
            <div className={styles.wrapper}>
                <IconChevronDown 
                    className={styles.folderChevron}
                    size={18} 
                    style={{ 
                        opacity: hasChildren ? 1 : 0,
                        transform: `rotate(${opened ? 0 : -90}deg)` 
                    }} 
                />

                <IconFolder size={18} fill="#f5d97a" color={"#f5d97a"} />
                <div className={styles.name}>
                    {folder.folderName}
                </div>
            </div>
        </UnstyledButton>

        <Collapse
            in={opened}
            transitionDuration={100}
            transitionTimingFunction="linear"
        >
            <div data-testId={"folder-children"}>
                {folders.map((step, childIndex) => (
                    <FileTreeFolder
                        folder={step}
                        order={order + 1}
                        index={childIndex}
                        isChild={true}
                    />
                ))}

                {files.map((step, childIndex) => (
                    <FileTreeFile
                        file={step}
                        order={order + 1}
                        index={childIndex}
                        isChild={true}
                    />
                ))}
            </div>
        </Collapse>
    </div>
))

export default FileTreeFolder