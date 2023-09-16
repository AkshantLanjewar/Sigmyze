import { memo, useCallback, useEffect, useState } from 'react'
import { ISigmyzeFile } from '../types'
import styles from './file-tree-view.module.scss'
import { UnstyledButton } from '@mantine/core'
import { IconChartAreaLine, IconFileDescription } from '@tabler/icons'

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
    setItemActive?: (itemId: string, itemType: string) => void
}

/**
 * NOTE: This component should only be used within the context of the FileTreeView component
 * this component renders a FileTreeFile within the editor, and adds appropriate amounts of padding when necessary
 */
const FileTreeFile: React.FC<IFileTreeFileProps> = ({ index, file, order, isChild, activeItemId, setItemActive }) => {
    //this is the parsed file type, undefined if not set
    const [fileType, setFileType] = useState<string | undefined>(undefined)
    //this is the padding for the element
    const [paddingLeft, setPaddingLeft] = useState(0)
    //whether or not this component is the active element
    const [active, setActive] = useState(false)

    /**
     * this effect aims to parse a fileType from the raw file type
     * provided in the file prop
     */
    useEffect(() => {
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
    }, [file, setItemActive, fileType])
    
    return (
        <View
            paddingLeft={paddingLeft}
            index={index}
            isChild={isChild}
            fileType={fileType}
            file={file}
            active={active}
            onClickHandler={onClickHandler}
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
     * this is the function that is called when the file button is clicked
     */
    onClickHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const View: React.FC<IViewProps> = memo(({ 
    paddingLeft, 
    index, 
    isChild, 
    fileType, 
    file, 
    active,
    onClickHandler 
}) => (
    <UnstyledButton 
        className={`${styles.element} ${active ? styles.active : ""}`}
        data-testId={`container-element-${index}${isChild ? "::child" : ""}`}
        data-testValue={`element-${fileType}`}
        style={{ paddingLeft: paddingLeft }}
        onClick={(e) => onClickHandler(e)}
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
))

export default FileTreeFile