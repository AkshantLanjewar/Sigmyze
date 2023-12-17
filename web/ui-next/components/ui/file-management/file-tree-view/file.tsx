import { Dispatch, SetStateAction, memo, useCallback, useEffect, useState } from 'react'
import { ISigmyzeFile, ISigmyzeFileChild } from '../types'
import styles from './file-tree-view.module.scss'
import { Collapse, UnstyledButton } from '@mantine/core'
import { IconChartAreaLine, IconFileDescription, IconRadar } from '@tabler/icons'
import { IQuantaIndicatorLoc } from '../../../lunar-refresh/data-manager/state'

const BASE_PADDING = 15
const PADDING_INCREMENT = 23

/**
 * NOTE: This component should only be used within the context of the FileTreeFile component
 * This is the function that renders an icon based on the file type provided
 * 
 * @param fileType 
 * this is the parsed file type that we want the icon for. 
 */
const IconFileRenderer = (fileType: string): React.ReactNode => {
    switch(fileType) {
        case "chart":
            return <IconChartAreaLine size={18} />
        case "note":
            return <IconFileDescription size={18} fill='white' color='#c1c2c5' />
        case "radar":
            return <IconRadar size={18} />
        default:
            return null
    }
}

/**
 * theese are all the required and optional props for the FileTreeFile component
 */
interface IFileTreeFileProps {
    /**
     * NOTE: this prop is for testing purposes only
     * this is the index of the file in its respective list of rendered files
     */
    index: number,

    /**
     * this is the actual file data, passed down from either the Folder or FileTree component
     */
    file: ISigmyzeFile,

    /**
     * the order of the file determines the amount of padding is applied to the file
     * order 1 means this file is the child of another folder, and as a result, it will add additional padding to visually 
     * indicate as so
     */
    order: number,

    /**
     * NOTE: This prop is for testing purposes only
     * this is whether or not this file is the child of a folder or not
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
     * @description
     *  - this is the function that opens a new tab within the viewport
     * @param fileId 
     *  - this is the id of the file we want to open in the viewport
     */
    openTab: (fileId: string) => void,
    
    /**
     * @description
     *  - this is the function passed to the file tree which can set the active set of portal buttons
     * @param portalId 
     *  - this is the type of portal buttons we want to be rendered
     * @param itemId 
     *  - this is the id of the item being requested NOTE: only needed for folders
     */
    assignPortalButtons?: (portalId: string, itemId: string) => void,

    /**
     * Function that sets the event indicator
     */
    setEventIndicator?: Dispatch<SetStateAction<IQuantaIndicatorLoc | undefined>>
}

/**
 * NOTE: This component should only be used within the context of the FileTreeView component
 * this component renders a FileTreeFile within the editor, and adds appropriate amounts of padding when necessary
 */
const FileTreeFile: React.FC<IFileTreeFileProps> = ({ 
    index, 
    file, 
    order, 
    isChild, 
    activeItemId, 
    setItemActive, 
    openTab,
    assignPortalButtons,
    setEventIndicator 
}) => {
    //this is the parsed file type, undefined if not set
    const [fileType, setFileType] = useState<string | undefined>(undefined)
    //this is the padding for the element
    const [paddingLeft, setPaddingLeft] = useState(0)
    //whether or not this component is the active element
    const [active, setActive] = useState(false)
    //these are the children to be displayed if it has any
    const [fileChildren, setFileChildren] = useState<ISigmyzeFileChild[]>([])
    //this is the internally active element, used to track children within the file component
    const [internalActive, setInternalActive] = useState<string | undefined>(undefined)

    /**
     * This is the effect that calculates whether or not the internal active is in the file's children
     * if it isnt, it reverts focus back to the parent file
     */
    useEffect(() => {
        if(internalActive === undefined)
            return

        let childExists = false
        for(let i = 0; i < fileChildren.length; i++) {
            let child = fileChildren[i]
            if(child.text === internalActive)
                childExists = true
        }

        if(childExists === false) {
            setInternalActive(undefined)
            assignPortalButtons ? assignPortalButtons("chart", "swag") : null
            setEventIndicator ? setEventIndicator(undefined) : null
        }
    }, [fileChildren, internalActive])

    /**
     * this effect aims to parse a fileType from the raw file type
     * provided in the file prop, as well as update the internal fileChildren
     * state.
     */
    useEffect(() => {
        //first let us get the file children
        let children = file.children
        if(children !== undefined)
            setFileChildren([ ...children ])

        let typeSplit = file.fileType.split("::")
        if(typeSplit.length < 2)
            return

        setFileType(typeSplit[1])
    }, [file])

    /**
     * this effect computes the paddingLeft for the component
     * based on the passed order
     */
    useEffect(() => {
        let computedPadding = BASE_PADDING
        computedPadding = computedPadding + (order * PADDING_INCREMENT)

        setPaddingLeft(computedPadding)
    }, [order])

    /**
     * this is the effect that determines whether or not the rendered file is active or not
     */
    useEffect(() => {
        let isActive = false
        if(activeItemId === file.fileId)
            isActive = true
        if(isActive === false && active === true && setEventIndicator !== undefined)
            setEventIndicator(undefined)

        setActive(isActive)
    }, [file, activeItemId])


    /**
     * this function handles setting the file to be active whenever the button is clicked in the render view
     */
    const onClickHandler = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        if(setItemActive === undefined || fileType === undefined)
            return

        let fileId = file.fileId
        setItemActive(fileId, fileType)
        setInternalActive(undefined)

        if(setEventIndicator !== undefined)
            setEventIndicator(undefined)
    }, [file, setItemActive, fileType, setEventIndicator])

    /**
     * @description
     *  - This is the function that handles when a file child is clicked
     * @param childId
     *  - this is the ID of the child element for the file
     */
    const onClickChildHandler = (childId: string, indicator?: IQuantaIndicatorLoc) => {
        if(active === false)
            return

        setInternalActive(childId)
        if(file.fileType === "quanta::chart" && indicator !== undefined) {
            assignPortalButtons ? assignPortalButtons("indicator", "swag") : null
            setEventIndicator ? setEventIndicator({ ...indicator }) : null
        }
    }
    
    return (
        <View
            paddingLeft={paddingLeft}
            index={index}
            isChild={isChild}
            fileType={fileType}
            file={file}
            active={active && internalActive === undefined}
            rActive={active}
            fileChildren={fileChildren}
            internalActive={internalActive}
            onClickHandler={onClickHandler}
            openTab={openTab}
            onClickChildHandler={onClickChildHandler}
        />
    )
}

/**
 * theese are the required props in order for the FileTreeFileView to render
 */
interface IViewProps {
    /**
     * this is the raw number of pixels we want to set the paddingLeft css value to 
     */
    paddingLeft: number,

    /**
     * this is the index it was rendered in the list, used only for DEBUGGING purposes
     */
    index: number,

    /**
     * whether or not the file is a child of a folder, used only for DEBUGGING purposes
     */
    isChild: boolean | undefined

    /**
     * this is the parsed file type, undefined if not parsed
     */
    fileType: string | undefined

    /**
     * the raw file passed to the component
     */
    file: ISigmyzeFile,

    /**
     * whether or not the rendered file is active or not
     */
    active: boolean,

    /**
     * real active value
     */
    rActive: boolean,

    /**
     * These ar the children to be displayed for the file
     */
    fileChildren: ISigmyzeFileChild[],

    /**
     * This is the item that is internally active
     */
    internalActive: string | undefined,

    /**
     * this is the function that is called when the file button is clicked
     */
    onClickHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,

    /**
     * @description
     *  - this is the function that opens a new tab within the viewport
     * @param fileId 
     *  - this is the id of the file we want to open in the viewport
     */
    openTab: (fileId: string) => void,
    
    /**
     * @description
     *  - this is the function that handles the onCLick event for a child element
     * @param childId 
     *  - the id of the child element
     */
    onClickChildHandler: (childId: string, indicator?: IQuantaIndicatorLoc) => void
}

const View: React.FC<IViewProps> = memo(({ 
    paddingLeft, 
    index, 
    isChild, 
    fileType, 
    file, 
    active,
    rActive,
    fileChildren,
    internalActive,
    onClickHandler,
    openTab,
    onClickChildHandler 
}) => (
    <div data-testId={`container-element-${index}${isChild ? "::child" : ""}`}>
        <UnstyledButton 
            className={`${styles.element} ${active ? styles.active : ""}`}
            data-testValue={`element-${fileType}`}
            style={{ paddingLeft: paddingLeft }}
            onClick={(e) => {
                openTab(file.fileId)
                onClickHandler(e)
            }}
        >
            <div className={styles.wrapper}>
                {fileType
                    ? IconFileRenderer(fileType)
                    : null
                }

                <div className={styles.name}>
                    {file.fileName}
                </div>
            </div>
        </UnstyledButton>

        {fileChildren.length > 0 && (
            <Collapse
                in={rActive}
                transitionDuration={100}
                transitionTimingFunction="linear"
            >
                <div data-testId={"element-children"}>
                    {fileChildren.map((step, index) => (
                        <div 
                            data-testId={`container-element-${index}::child::tmp`}
                            className={`${styles.element} ${step.text === internalActive ? styles.active : ""}`}
                            style={{ paddingLeft: paddingLeft + PADDING_INCREMENT }}
                            onClick={() => onClickChildHandler(step.text, step.indicator)}
                        >
                            <div className={styles.wrapper}>
                                {IconFileRenderer(step.icon)}

                                <div className={styles.name}>
                                    {step.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Collapse>
        )}
    </div>
))

export { IconFileRenderer }
export default FileTreeFile