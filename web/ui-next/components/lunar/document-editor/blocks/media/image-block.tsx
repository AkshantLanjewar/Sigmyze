import { useEffect, useState } from "react"
import { IDocumentBlock } from "../../../../data/lunar/document-types"
import { ChartDims } from "../../../chart-view/engine/types"
import { ActionIcon, Group, Image, UnstyledButton } from '@mantine/core'
import { IconGripVertical } from "@tabler/icons"
import { useClickOutside, useHover } from "@mantine/hooks"
import { Resizable } from "re-resizable"
import styles from './image-block.module.scss'

interface IImageBlockProps {
    block: IDocumentBlock,
    getImage: (id: string) => string | null
}

const Handle = (props: any) => (
    <div {...props}>
        <div className={`
            ${styles.handle} 
            ${props.dir === 'right' && styles.right}
            ${props.dir === 'left' && styles.left}
            ${props.active && styles.active}
        `} />
    </div>
)

const ImageBlock: React.FC<IImageBlockProps> = ({ block, getImage }) => {
    const [active, setActive] = useState(false)
    const [maintainAspect, setMaintainAspect] = useState(true)
    const [dims, setDims] = useState<ChartDims | null>(null)
    const [imageData, setImageData] = useState<string | null>(null)

    const { hovered, ref } = useHover()
    const clickRef = useClickOutside<HTMLDivElement>(() => { setActive(false) })

    useEffect(() => {
        if(block.width === undefined || block.height === undefined)
            return

        let nDims = {
            x: block.width,
            y: block.height
        } as ChartDims

        if(nDims.x > 664 && maintainAspect) {
            let ratio = nDims.x / nDims.y
            nDims.x = 664
            nDims.y = 664 / ratio
        }

        setDims({ ...nDims })

        //get the image
        let imageId = block.imageData
        if(imageId === undefined)
            return

        let imageData_ = getImage(imageId)
        if(imageData_ === null)
            return

        
        setImageData(imageData_)
    }, [block])

    return (
        <div ref={clickRef}>
            <Group
                noWrap={true}
                spacing={"xs"} 
                align={"center"}
                position={'center'}
                ref={ref}
            >
                <ActionIcon
                    variant={"transparent"}
                    color={"dark"}
                    radius={"sm"}
                    size={"xs"}
                    sx={{ opacity: hovered ? 1 : 0 }}
                >
                    <IconGripVertical />
                </ActionIcon>

                {dims && (
                    <Resizable
                        className={styles.resizeableWrapper}
                        maxWidth={664}
                        lockAspectRatio={maintainAspect}
                        size={{ width: dims.x, height: dims.y }}
                        enable={{
                            right: true,
                            left: true
                        }}
                        handleComponent={{
                            right: <Handle dir={'right'} active={hovered} />,
                            left: <Handle dir={'left'} active={hovered} />
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            setDims({ x: dims.x + d.width, y: dims.y + d.height })
                        }}
                    >
                        <UnstyledButton
                            onClick={() => { setActive(true) }}
                        >
                            <Image
                                width={"calc(100%)"}
                                withPlaceholder
                                radius={"md"}
                                src={imageData}
                            />
                        </UnstyledButton>
                    </Resizable>
                )}

                <ActionIcon
                    variant={"transparent"}
                    color={"dark"}
                    radius={"sm"}
                    size={"xs"}
                    sx={{ opacity: 0, pointerEvents: 'none' }}
                />
            </Group>
        </div>
    )
}

export default ImageBlock