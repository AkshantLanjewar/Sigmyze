import { IconBrandNpm, IconChevronDown } from '@tabler/icons'
import styles from './file.module.scss'
import { IFile } from '../types'
import { MouseEvent, useContext, useEffect, useState } from 'react'
import { CodeEditorContextData } from '..'
import { ICodeEditorState } from '../state'

interface IFileItemProps {
    additionalPadding?: number,
    file: IFile
}

const FileItem: React.FC<IFileItemProps> = ({ file, additionalPadding }) => {
    const [active, setActive] = useState(false)

    const { activeItem, openFile } = useContext(CodeEditorContextData) as ICodeEditorState

    useEffect(() => {
        setActive(false)
        if(activeItem === file.item_id)
            setActive(true)
    }, [activeItem])

    const fileClicked = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.stopPropagation()
        if(file.item_id === undefined)
            return

        openFile(file.item_id)
    }

    return (
        <div className={`${styles.container} ${active ? styles.active : ''}`}>
            <div 
                className={styles.inner}
                style={{ paddingLeft: `calc(.5em + ${additionalPadding ? additionalPadding : 0}px)` }}
                onClick={e => fileClicked(e)}
            >
                <IconChevronDown size={18} opacity={0} /> 
                <IconBrandNpm size={18} />

                <div className={styles.text__container}>
                    {file.file_name}.{file.file_type}
                </div>
            </div>
        </div>
    )
}

export default FileItem