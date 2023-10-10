import { memo, useCallback, useEffect, useState } from "react"
import { ISigmyzeFile, ISigmyzeFolder } from "../types"

import styles from './file-tree-view.module.scss'
import { IconChevronDown, IconFolder } from "@tabler/icons"
import { Collapse, UnstyledButton } from "@mantine/core"
import FileTreeFile from "./file"
import { isChildActive } from "./functions"

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
     * theese are the subfolders within the folder
     */
    subFolders: ISigmyzeFolder[],

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
    isChild?: boolean,

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
    setFolderOpenState: (folderId: string, openState: boolean) => void,

    /**
     * @description
     *  - this is the function that opens a new tab within the viewport
     * @param fileId 
     *  - this is the id of the file we want to open in the viewport
     */
    openTab: (fileId: string) => void 
}

/**
 * NOTE: This component should only be used within the context of the FileTreeView component.
 * This component renders a folder, and any children a folder may have within it.
 */
const FileTreeFolder: React.FC<IFileTreeFolderProps> = ({ 
    folder, 
    subFolders,
    order, 
    index, 
    isChild, 
    activeItemId,
    setItemActive,
    setFolderOpenState,
    openTab 
}) => {
    //theese are the child components of the folder
    const [folders, setFolders] = useState<ISigmyzeFolder[]>([])
    const [files, setFiles] = useState<ISigmyzeFile[]>([])
    //this is related to how indented the display is
    const [paddingLeft, setPaddingLeft] = useState(0)
    //whether or not the folder has children
    const [hasChildren, setHasChildren] = useState(false)
    //whether or not you can see the children
    const [opened, setOpened] = useState(folder.openState ? folder.openState : false)
    //whether or not to append the child to its testId locator
    const [appendChild, setAppendChild] = useState(false)
    //whether or not the folder is active or note
    const [active, setActive] = useState(false)

    /**
     * this effect makes sure that the folder is opened if the openMount option is set to true
     */
    useEffect(() => {
        if(folder.openMount === undefined)
            return

        setOpened(folder.openMount)
    }, [folder])

    /**
     * effect that sets the persist value when the folder changes
     * TODO: Implement a folder skip ref so that this doesnt keep going on and on
     */
    useEffect(() => {
        let persistValue = false
        if(folder.openState !== undefined)
            persistValue = folder.openState

        setOpened(persistValue)
    }, [folder])

    /**
     * this is the folder active effect
     * it checks if the active item === the folder id in order to setactive to true or not
     */
    useEffect(() => {
        let isActive = false
        if(folder.folderId === activeItemId)
            isActive = true

        setActive(isActive)
    }, [activeItemId, folder])

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
     * this effect determines if a child element is active or not
     * if a child element is indeed active, then we will set this folder's open state to opened
     */
    useEffect(() => {
        if(activeItemId === undefined)
            return
        if(isChildActive(folder, activeItemId) === true)
            setOpened(true)
    }, [activeItemId, folder])

    /**
     * this function handles when the folder is clicked on, so as to toggle the 
     * folder open / close state
     */
    const onClickHandler = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let openedVal = !opened        
        e.stopPropagation()
        //set the key variables for the opened state
        setOpened(openedVal)
        setFolderOpenState(folder.folderId, openedVal)
        //now we want a function that persists the state of the folder so that when it re renders it doesnt close

        let folderId = folder.folderId
        if(setItemActive !== undefined)
            setItemActive(folderId, 'folder')
    }, [opened, folder, setItemActive, active, setFolderOpenState])

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
            folders={subFolders}
            activeItemId={activeItemId}
            active={active}
            onClickHandler={onClickHandler}
            setItemActive={setItemActive}
            setFolderOpenState={setFolderOpenState}
            openTab={openTab}
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
     * this is the id of the active item within the filesystem. it is controlled externally.
     * If set to a value, the node with the matching ID will be highlighted within the file tree editor
     */
    activeItemId: string | undefined,

    /**
     * this is whether or not the folder is active within the filetree or not 
     */
    active: boolean,

    /**
     * function that is called whenever you click on the folder
     */
    onClickHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,

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
    setFolderOpenState: (folderId: string, openState: boolean) => void,

    /**
     * @description
     *  - this is the function that opens a new tab within the viewport
     * @param fileId 
     *  - this is the id of the file we want to open in the viewport
     */
    openTab: (fileId: string) => void 
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
    activeItemId,
    active,
    onClickHandler,
    setItemActive,
    setFolderOpenState,
    openTab
}) => (
    <div
        data-testId={`container-folder-${index}${appendChild ? "::child" : ""}`} 
        data-testvalue={'element-folder'}
        style={{ width: "100%" }}
    >
        <UnstyledButton 
            className={`${styles.element} ${active ? styles.active : ""}`}
            style={{ paddingLeft: `${paddingLeft}px` }}
            onClick={(e) => onClickHandler(e)}
        >
            <div className={styles.wrapper}>
                <IconChevronDown 
                    className={styles.folderChevron}
                    size={18} 
                    style={{ 
                        display: hasChildren ? 'block' : 'none',
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
                        subFolders={step.folders}
                        order={order + 1}
                        index={childIndex}
                        activeItemId={activeItemId}
                        isChild={true}
                        setItemActive={setItemActive}
                        key={`${step.folderId}-${step.folders.length}-${step.files.length}`}
                        setFolderOpenState={setFolderOpenState}
                        openTab={openTab}
                    />
                ))}

                {files.map((step, childIndex) => (
                    <FileTreeFile
                        file={step}
                        order={order + 1}
                        index={childIndex}
                        isChild={true}
                        activeItemId={activeItemId}
                        setItemActive={setItemActive}
                        key={step.fileId}
                        openTab={openTab}
                    />
                ))}
            </div>
        </Collapse>
    </div>
))

export default FileTreeFolder