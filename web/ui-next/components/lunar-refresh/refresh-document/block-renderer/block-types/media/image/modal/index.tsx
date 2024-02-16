import { ActionIcon, Button, Group, Image, Modal, Popover, Progress, Text, ThemeIcon } from "@mantine/core"
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone'
import React, { RefObject, useRef, useState } from "react"
import styles from './index.module.scss'
import { IconCloudDownload, IconPhoto, IconWorldUpload, IconX } from "@tabler/icons"
import { useDisclosure } from "@mantine/hooks"
import { IQuantaXYPos } from "../../../../../../../quanta/quanta-editor/types/nodes"
import { ISerializedNoteImage } from "../../types"
import { Blocks } from "../../../../../types"
import Dropview from "./dropview"
import LoadedImage from "./loaded-image"

interface IImageLoadState {
    /**
     * This is the title of the image that is being loaded in
     */
    title: string,

    /**
     * This is the size of the image in mb
     */
    size: number,

    /**
     * This is the loading percent
     */
    loadingPercent: number
}


interface INoteImageModalProps {
    /**
     * Id for the block, used to change the note block
     */
    blockId: string,

    /**
     * This is whether or not the modal is opened. Managed by the selected chart state
     */
    open: boolean,

    /**
     * This is the function that cancels the selection flow
     */
    cancel: () => void,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * This is the function that updates the image within the image block
     */
    updateImage: (newImage: ISerializedNoteImage) => void,

    /**
     * This is the function that inserts a RAW new block
     */
    createRawBlock: (type: Blocks) => void,
}

const NoteImageModal: React.FC<INoteImageModalProps> = ({ blockId, open, cancel, updateNoteBlock, updateImage, createRawBlock }) => {
    //open ref for the dropzone
    const openRef = useRef<() => void>(null)
    //this is the image that has been loaded by the modal
    const [loadedImage, setLoadedImage] = useState<string | null>(null)
    //this is the loading state for when the image is being loaded in from disk
    const [imageLoad, setImageLoad] = useState<IImageLoadState | null>(null)
    //these are the dims for the image
    const [dims, setDims] = useState<IQuantaXYPos | null>(null)

    /**
     * @description
     *  - this is the function that handles a file being dropped into the form
     * @param files 
     *  - the files that were added
     */
    const dropHandler = (files: FileWithPath[]) => {
        if(files.length === 0)
            return

        const file = files[0]
        let loadState: IImageLoadState = {
            title: file.name,
            size: file.size / (1024 ** 2),
            loadingPercent: 20
        }

        setImageLoad({ ...loadState })
        //load the file into data
        let reader = new FileReader()
        reader.readAsDataURL(file)

        loadState.loadingPercent = 50
        setImageLoad({ ...loadState })

        reader.onload = () => {
            loadState.loadingPercent = 80
            setImageLoad({ ...loadState })
            if(reader.result === null)
                return

            let imgSrc = reader.result.toString()
            let imageLoad = new globalThis.Image()
            imageLoad.src = imgSrc

            imageLoad.onload = () => {
                let width = imageLoad.width
                let height = imageLoad.height
                loadState.loadingPercent = 100

                const ratio = height / width
                if(width > 800) {
                    width = 800
                    height = ratio * width
                }

                setDims({ x: width, y: height })
                setLoadedImage(imgSrc)
                setImageLoad({ ...loadState })
            }
        }
    }

    const createImage = () => {
        if(loadedImage === null || dims === null)
            return

        let serializedData = {} as ISerializedNoteImage
        serializedData.marshalCheck = "swagmarsh"
        serializedData.data = loadedImage
        serializedData.width = dims.x
        serializedData.height = dims.y

        const serialized = JSON.stringify(serializedData)
        updateNoteBlock(blockId, serialized)
        updateImage(serializedData)
        createRawBlock("paragraph")
    }

    const resetImage = () => {
        setImageLoad(null)
        setLoadedImage(null)
        setDims(null)
    }

    return (
        <Modal
            opened={open}
            onClose={() => cancel()}
            title={"Select Image"}
            overlayBlur={4}
            transitionDuration={200}
            exitTransitionDuration={200}
            transition={"pop"}
            centered
            size={"lg"}
        >
            <div data-testId={'upload-image-modal'}>
                {loadedImage === null
                    ? (
                        <Dropview
                            openRef={openRef}
                            dropHandler={dropHandler}
                        />
                    )
                    : (
                        <Image
                            width={"100%"}
                            src={loadedImage}
                            radius={'md'}
                            mt={20}
                            mb={20}
                            withPlaceholder
                        />
                    )
                }

                {imageLoad !== null && (
                    <LoadedImage
                        imageLoad={imageLoad}
                        resetImage={resetImage}
                    />
                )}

                <Group position={"center"} pt={20}>
                    <Button
                        size="md"
                        radius={"md"}
                        color="red"
                        variant="outline"
                        sx={{ width: 110 }}
                        onClick={() => cancel()}
                        data-testId={'cancel-upload'}
                    >
                        Cancel
                    </Button>

                    <Button
                        size={'md'}
                        radius={'md'}
                        color={'indigo'}
                        sx={{ width: 110 }}
                        disabled={loadedImage === null}
                        onClick={() => createImage()}
                        data-testId={'submit-upload'}
                    >
                        Upload
                    </Button>
                </Group>
            </div>
        </Modal>
    )
}

export type { IImageLoadState }
export default NoteImageModal