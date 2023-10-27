import { UnstyledButton } from "@mantine/core"
import styles from './index.module.scss'
import { IconBallpen } from "@tabler/icons"
import { useCallback, useEffect, useRef } from "react"
import sanitizeHtml from 'sanitize-html'

interface IChartTitleProps {
    chartTitle: string | undefined,
    editChartTitle: (newTitle: string) => void
}

const ChartTitle: React.FC<IChartTitleProps> = ({ chartTitle, editChartTitle }) => {
    const textRef = useRef<HTMLSpanElement>(null)
    
    const onContentBlur = useCallback((event: React.FocusEvent<HTMLSpanElement, Element>) => {
        const sanitizeConf: sanitizeHtml.IOptions = {
            allowedTags: ["b", "i", "p"],
            allowedAttributes: {}
        }

        editChartTitle(sanitizeHtml(event.currentTarget.innerHTML, sanitizeConf))
    }, [])

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
            data-testId={'chart-name'}
        >
            <UnstyledButton onClick={() => onClick()}>
                {chartTitle && (
                    <span 
                        contentEditable
                        tabIndex={0}
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