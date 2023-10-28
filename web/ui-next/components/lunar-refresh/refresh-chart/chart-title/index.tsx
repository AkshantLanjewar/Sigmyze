import { UnstyledButton } from "@mantine/core"
import styles from './index.module.scss'
import { IconBallpen } from "@tabler/icons"
import { useCallback, useEffect, useRef } from "react"
import sanitizeHtml from 'sanitize-html'

/**
 * @description
 *  - theese are the props for the ChartTitle component to work
 */
interface IChartTitleProps {
    /**
     * This is the FileId for the chart the title is in
     */
    fileId: string,

    /**
     * This is the controlled state for the chart title
     */
    chartTitle: string | undefined,
    editChartTitle: (newTitle: string, filesystemUpdate?: boolean) => void,
    editFileTitle: (fileId: string, fileType: string, newTitle: string) => void
}

const ChartTitle: React.FC<IChartTitleProps> = ({ fileId, chartTitle, editChartTitle, editFileTitle }) => {
    const textRef = useRef<HTMLSpanElement>(null)
    
    const onContentBlur = useCallback((event: React.FocusEvent<HTMLSpanElement, Element>) => {
        const sanitizeConf: sanitizeHtml.IOptions = {
            allowedTags: ["b", "i", "p"],
            allowedAttributes: {}
        }

        let sanitizedTitle = sanitizeHtml(event.currentTarget.innerHTML, sanitizeConf)
        editChartTitle(sanitizedTitle)
        editFileTitle(fileId, "chart", sanitizedTitle)
    }, [editFileTitle])

    const onClick = useCallback(() => {
        if(textRef.current === null)
            return

        textRef.current.focus()
        if(typeof window.getSelection == "undefined" && typeof document.createRange == "undefined")
            return

        let range = document.createRange()
        range.selectNodeContents(textRef.current)
        range.collapse(false)

        let selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
    }, [])
    
    return (
        <div 
            className={styles.chart__title}
            data-testId={'chart-title'}
        >
            <UnstyledButton onClick={() => onClick()}>
                {chartTitle && (
                    <span 
                        contentEditable
                        tabIndex={0}
                        onClick={e => e.stopPropagation()}
                        onBlur={e => onContentBlur(e)}
                        dangerouslySetInnerHTML={{__html: chartTitle}}
                        ref={textRef}
                    />
                )}

                <IconBallpen size={18} />
            </UnstyledButton>
        </div>
    )
}

export default ChartTitle