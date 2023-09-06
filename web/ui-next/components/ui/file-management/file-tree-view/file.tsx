import { memo, useEffect, useState } from 'react'
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
    isChild?: boolean
}

/**
 * NOTE: This component should only be used within the context of the FileTreeView component
 * this component renders a FileTreeFile within the editor, and adds appropriate amounts of padding when necessary
 */
const FileTreeFile: React.FC<IFileTreeFileProps> = ({ index, file, order, isChild }) => {
    //this is the parsed file type, undefined if not set
    const [fileType, setFileType] = useState<string | undefined>(undefined)
    //this is the padding for the element
    const [paddingLeft, setPaddingLeft] = useState(0)

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
    
    return (
        <View
            paddingLeft={paddingLeft}
            index={index}
            isChild={isChild}
            fileType={fileType}
            file={file}
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
    file: ISigmyzeFile
}

const View: React.FC<IViewProps> = memo(({ paddingLeft, index, isChild, fileType, file }) => (
    <UnstyledButton 
        className={styles.element}
        data-testId={`container-element-${index}${isChild ? "::child" : ""}`}
        data-testValue={`element-${fileType}`}
        style={{ paddingLeft: paddingLeft }}
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