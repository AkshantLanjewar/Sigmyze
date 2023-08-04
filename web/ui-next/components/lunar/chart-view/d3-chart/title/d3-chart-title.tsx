import styles from './d3-chart-title.module.scss'
import { FocusTrap, MantineNumberSize, Text } from "@mantine/core"
import { ChangeEvent, useEffect, useState } from "react"
import { ILunarUIData } from "../../../../data/lunar/types/types"
import { ChartDims } from "../../engine/types"
import { useClickOutside } from '@mantine/hooks'

//click item
interface IClickItemProps {
    ui: ILunarUIData | null | undefined,
    nodeId: string | null,
    value: string,
    size: MantineNumberSize,
    weight: string,
    useActive?: boolean,
    type?: string
    setChartTitle: Function
}

const ClickItem: React.FC<IClickItemProps> = 
    ({ ui, nodeId, value, size, weight, useActive, type, setChartTitle }) => {
    const [active, setActive] = useState(false)
    const [dims, setDims] = useState<ChartDims>({ x: 0, y: 0 })
    const [tmpVal, setTmpVal] = useState("")

    function onClickChange(e: ChangeEvent<HTMLInputElement>) {
        setTmpVal(e.target.value)
    }

    function TitleBlur() {
        if(ui === null || ui === undefined)
            return
        if(tmpVal === "")
            return
        
        setChartTitle(nodeId, tmpVal)
        setTmpVal("")
    }

    const ref = useClickOutside<HTMLDivElement>(() => setActive(false))
    function ItemClicked() {
        const boundingRect = ref.current.getBoundingClientRect()

        setDims({ x: boundingRect.width, y: boundingRect.height })

        if(useActive === undefined || useActive === true)          
            setActive(true)
    }

    useEffect(() => {
        if(active)
            setTmpVal(value)
        else {
            if(type === 'chart-title')
                TitleBlur()

            setTmpVal('')
        }
    }, [active])

    return (
        <div 
            ref={ref}
            className={`${styles.clickItem} ${active ? styles.active : null}`}
            onClick={(e) => ItemClicked()}
            style={{
                width: 'auto',
                height: active ? dims.y : 'auto',
                minWidth: active ? dims.x : 0
            }}
        >
            {active
                ? (
                    <FocusTrap active={true}>
                        <div>
                            <input
                                className={styles.textInput}
                                data-autofocus
                                value={tmpVal}
                                onChange={onClickChange}
                            />
                        </div>
                    </FocusTrap>
                )
                : (
                    <Text 
                        size={size}
                        weight={weight}
                    >
                        {value}
                    </Text>
                )
            }
        </div>
    )
}

export { ClickItem }