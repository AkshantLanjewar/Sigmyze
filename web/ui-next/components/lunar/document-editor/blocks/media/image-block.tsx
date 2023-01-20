import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IActionMenuItem, IDocumentBlock } from "../../../../data/lunar/document-types"
import { ChartDims } from "../../../chart-view/engine/types"
import { ActionIcon, Group, Image, Tooltip, UnstyledButton } from '@mantine/core'
import { IconEdit, IconGripVertical, IconPlus, IconTrash } from "@tabler/icons"
import { useClickOutside, useHover } from "@mantine/hooks"
import { Resizable } from "re-resizable"
import styles from './image-block.module.scss'
import { createBlock, deleteBlock } from "../../document-editor"
import { v4 } from "uuid"

interface IImageBlockProps {
    block: IDocumentBlock,
    index: number,
    getImage: (id: string) => string | null,
    createBlock?: createBlock,
    deleteBlock?: deleteBlock,
    setActiveModal: Dispatch<SetStateAction<string | null>>
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

const ImageBlock: React.FC<IImageBlockProps> = ({ block, getImage, createBlock, deleteBlock, setActiveModal, index }) => {
    const [active, setActive] = useState(false)
    const [maintainAspect, setMaintainAspect] = useState(true)
    const [dims, setDims] = useState<ChartDims | null>(null)
    const [imageData, setImageData] = useState<string | null>(null)

    const { hovered, ref } = useHover()
    const clickRef = useClickOutside<HTMLDivElement>(() => { setActive(false) })

    //action menu definition
    const ImageActionMenu = [
        {
            icon: <IconPlus size={20} />,
            label: "Add Block",
            cb: () => { createBlockWrapper() }
        },
        {
            icon: <IconEdit size={20} />,
            label: "Edit Image",
            cb: () => { editImageWrapper() }
        },
        {
            icon: <IconTrash color={'#fa5252'} size={20} />,
            label: "Delete Image",
            cb: () => { deleteBlockWrapper() }
        }
    ] as IActionMenuItem[]

    //action item functions

    //close the action item menu
    function closeActionMenu() {
        setActive(false)
    }

    //create a new block function
    function createBlockWrapper() {
        if(createBlock === undefined)
            return

        let nBlock = {
            type: "paragraph",
            textNodes: [],
            id: v4(),
            leaf: false
        } as IDocumentBlock

        createBlock(nBlock, index + 1, true)
        closeActionMenu()
    }

    //delete the current image block
    function deleteBlockWrapper() {
        if(deleteBlock === undefined)
            return

        deleteBlock(block.id)
    }

    //edit the image modal
    function editImageWrapper() {
        setActiveModal("create_image")
    }

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
        <div>
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
                            sx={{ width: "100%" }}
                        >
                            <Image
                                width={"calc(100%)"}
                                withPlaceholder
                                radius={"md"}
                                src={imageData}
                            />
                        </UnstyledButton>

                        <div className={`${styles.actionMenu} ${active && styles.show}`} ref={active ? clickRef : null}>
                            {ImageActionMenu.map((step) => (
                                <UnstyledButton 
                                    className={styles.action}
                                    onClick={step.cb}
                                >
                                    <Tooltip
                                        label={step.label}
                                        withArrow
                                        position={'bottom'}
                                        color={"black"}
                                        offset={10}
                                    >
                                        <Group 
                                            position="center" 
                                            align={"center"}
                                            sx={{ width: '100%', height: '100%' }}
                                        >
                                            {step.icon}
                                        </Group>
                                    </Tooltip>
                                </UnstyledButton>
                            ))}
                        </div>
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