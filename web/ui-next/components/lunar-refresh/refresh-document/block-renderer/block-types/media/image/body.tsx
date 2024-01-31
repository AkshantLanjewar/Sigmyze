import { useEffect, useRef, useState } from "react"
import { ISerializedNoteImage } from "../types"
import { useClickOutside } from "@mantine/hooks"
import { IQuantaXYPos } from "../../../../../../quanta/quanta-editor/types/nodes"
import styles from '../chart/index.module.scss'
import ResizeableWrapper from "../resizeable-wrapper"
import { Image } from "@mantine/core"
import ActionMenu from "../media-action-menu"
import { IconTrash } from "@tabler/icons"
import ImageDeleteModal from "./modal/delete"

interface IImageBodyProps {
    /**
     * blockId for the block
     */
    blockId: string,

    /**
     * This is the image that is being rendered
     */
    image: ISerializedNoteImage,
    
    /**
     * whether or not there is a focus request within the editor
     */
    hasRequest: boolean,

    /**
     * This is the function that consumes a focus request
     */
    consumeFocusRequest: (blockId: string) => boolean,
    
    /**
     * This is the function that deletes a block from the renderer
     */
    deleteNoteBlock: (blockId: string) => void,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * This is the function that updates the image within the image block
     */
    updateImage: (newImage: ISerializedNoteImage) => void,
}

const ImageBody: React.FC<IImageBodyProps> = ({
    blockId,
    image,
    hasRequest,
    consumeFocusRequest,
    deleteNoteBlock,
    updateNoteBlock,
    updateImage
}) => {
    //whether or not the image is active
    const [active, setActive] = useState<boolean>(false)

    //flag to ignore image update
    const ignoreImageF = useRef<boolean>(false)
    //flag to ignore dims update
    const ignoreDimsF = useRef<boolean>(false)

    //click outside ref
    const ref = useClickOutside(() => {
        setActive(false)  
    })

    //these are the dimensions for the image
    const [dims, setDims] = useState<IQuantaXYPos>({ x: 400, y: 200 })

    //this is the state that will handle the toggling of the delete modal
    const [deleteToggle, setDeleteToggle] = useState<boolean>(false)
    //this is the function that toggles the delete modal
    const toggleDeleteModal = () => setDeleteToggle(!deleteToggle)

    useEffect(() => {
        if(hasRequest === false || consumeFocusRequest(blockId) === false)
            return

        setActive(true)
    }, [hasRequest])

    //set the dims on image change
    useEffect(() => {
        if(ignoreImageF.current === true) {
            ignoreImageF.current = false
            return
        }

        setDims({ x: image.width, y: image.height })
    }, [image])

    //this is the effect that updates the chart data when the dims change
    useEffect(() => {
        if(ignoreDimsF.current === true) {
            ignoreDimsF.current = false
            return
        }

        let newImage = image
        newImage.width = dims.x
        newImage.height = dims.y

        const serialized = JSON.stringify(newImage)
        ignoreImageF.current = true

        updateNoteBlock(blockId, serialized)
        updateImage(newImage)
    }, [dims])

    return (
        <div
            className={styles.body__wrapper}
            ref={ref}
            onClick={() => setActive(true)}
            data-testId={"image-body"}
        >
            <ResizeableWrapper
                dims={dims}
                maintainAspectRatio={true}
                hovered={active}
                setDims={setDims}
            >
                <div
                    className={`${styles.body__image} ${active ? styles.active : null}`}
                    style={{ width: active ? dims.x + 5 : dims.x, height: active ? dims.y + 5 : dims.y }}
                >
                    <ImageDeleteModal
                        toggle={deleteToggle}
                        blockId={blockId}
                        deleteNoteBlock={deleteNoteBlock}
                    />

                    <Image
                        width={"calc(100%)"}
                        withPlaceholder
                        radius={"md"}
                        src={image.data}
                    />

                    <ActionMenu
                        focused={active}
                        actions={[
                            {
                                label: "Delete Chart",
                                icon: <IconTrash size={18} />,
                                color: "red",
                                action: () => toggleDeleteModal()
                            }
                        ]}
                    />
                </div>
            </ResizeableWrapper>
        </div>
    )
}

export default ImageBody