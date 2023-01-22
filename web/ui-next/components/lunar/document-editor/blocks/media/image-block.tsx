import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IActionMenuItem, IDocumentBlock } from "../../../../data/lunar/document-types"
import { ChartDims } from "../../../chart-view/engine/types"
import { ActionIcon, Group, Image, Tooltip, UnstyledButton } from '@mantine/core'
import { IconEdit, IconGripVertical, IconPlus, IconTrash } from "@tabler/icons"
import { useClickOutside, useHover } from "@mantine/hooks"
import { Resizable } from "re-resizable"
import styles from '../action-menu.module.scss'
import { createBlock, deleteBlock } from "../../document-editor"
import { v4 } from "uuid"
import ResizableWrapper from "../resizable-wrapper"
import ActionMenu from "../action-menu"

interface IImageBlockProps {
    block: IDocumentBlock,
    index: number,
    getImage: (id: string) => string | null,
    setActiveModal: Dispatch<SetStateAction<string | null>>,
    createBlockWrapper: (callback: () => void) => void,
    deleteBlockWrapper: () => void,
    updateSizeWrapper: (dims: ChartDims | null) => void
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

const ImageBlock: React.FC<IImageBlockProps> = 
    ({ block, getImage, setActiveModal, deleteBlockWrapper, createBlockWrapper, updateSizeWrapper }) => {
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
            cb: () => { createBlockWrapper(closeActionMenu) }
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

    //edit the image modal
    function editImageWrapper() {
        setActiveModal("create_image")
    }

    //update when the block updates
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

    function setDims_(value: ChartDims) {
        setDims(value)
        updateSizeWrapper(value)
    }

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
                    <ResizableWrapper
                        dims={dims}
                        setDims={setDims_}
                        maintainAspectRatio={maintainAspect}
                        hovered={hovered}
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

                        <ActionMenu
                            active={active}
                            items={ImageActionMenu}
                            ref={clickRef}
                        />
                    </ResizableWrapper>
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