import { useEffect, useRef, useState } from "react"
import styles from './index.module.scss'
import { useClickOutside } from "@mantine/hooks"

interface INoteTitle {
    /**
     * This is the current title of the note
     */
    title: string,

    /**
     * This is the function that can edit the note title
     */
    editNoteName: (newTitle: string) => void
}

const NoteTitle: React.FC<INoteTitle> = ({ title, editNoteName }) => {
    //this is the ref for the title div
    const titleRef = useRef<HTMLDivElement>(null)

    //this is the click outside ref
    const ref = useClickOutside(() => {
        let title = titleRef.current
        if(title === null)
            return

        title.blur()
    })

    //this is the internal buffer for the note title
    const [buffer, setBuffer] = useState<string | undefined>(undefined)

    //this is the flag to clear the buffer
    const [clearBuffer, setClearBuffer] = useState<boolean>(false)

    //this is the effect that drains the buffer and edits the note's name
    useEffect(() => {
        if(buffer === undefined)
            return

        editNoteName(buffer)
        setBuffer(undefined)
    }, [clearBuffer])
    
    return (
        <div ref={ref}>
            <div 
                contentEditable={true}
                onInput={e => setBuffer(e.currentTarget.textContent || undefined)}
                onBlur={e => setClearBuffer(!clearBuffer)}
                className={styles.note__title}
                ref={titleRef}
            >
                {title}
            </div>
        </div>
    )
}

export default NoteTitle