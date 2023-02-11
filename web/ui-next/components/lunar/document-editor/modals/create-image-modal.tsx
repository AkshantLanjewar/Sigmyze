import styles from './create-modal.module.scss'
import { ActionIcon, Button, Group, Image, Modal, Popover, Progress, Text, ThemeIcon } from "@mantine/core"
import { useEffect, useRef, useState } from 'react'
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone'
import { IconCloudDownload, IconWorldUpload, IconX, IconPhoto } from '@tabler/icons'
import { useDisclosure } from '@mantine/hooks'
import { MediaTypes, TextTypes } from '../../../data/lunar/types/document-types'
import { ICreateMediaBlockData } from '../document-block'
import { ChartDims } from '../../chart-view/engine/types'

interface ImageLoadState {
    title: string,
    size: number,
    loadingPercent: number
}

interface ICreateImageModalProps {
    active: boolean,
    close: () => void,
    createBlock: (type: TextTypes | MediaTypes, data: ICreateMediaBlockData) => void,
    loadImage: (imageData: string) => string
}

const CreateImageModal: React.FC<ICreateImageModalProps> = ({ active, close, createBlock, loadImage }) => {
    const openRef = useRef<() => void>(null)

    const [popoverOpened, popoverHandlers] = useDisclosure(false)
    const [imageLoad, setImageLoad] = useState<ImageLoadState | null>(null)
    const [loadedImage, setLoadedImage] = useState<string | null>(null)
    const [dims, setDims] = useState<ChartDims | null>(null)

    //reset the loaded image on modal change
    useEffect(() => {
        if(active === false)
            resetImage()
    }, [active])

    //text popover to explain what image types are uploadable
    const imagesPopover = (
        <Popover
            opened={popoverOpened}
            width={200}
            position={'bottom'}
            shadow={'md'}
            withArrow
        >
            <Popover.Target>
                <Text
                    className={styles.imagesText}
                    c={"blue"}
                    onMouseEnter={popoverHandlers.open}
                    onMouseLeave={popoverHandlers.close}
                >
                    images
                </Text>
            </Popover.Target>

            <Popover.Dropdown sx={(theme) => ({ pointerEvents: 'none', backgroundColor: theme.colors.dark[9] })}>
                <Text 
                    size={"sm"}
                    color={'white'}
                >
                    Image Types Accepted: <b>.png</b>, <b>.jpeg</b>
                </Text>
            </Popover.Dropdown>
        </Popover>
    )

    //image display view
    let imageView = (
        <Image
            width={"100%"}
            src={loadedImage}
            radius={'md'}
            mt={20}
            mb={20}
            withPlaceholder
        />
    )

    let dropView = (
        <div className={styles['dropzone-wrapper']}>
            <Dropzone
                openRef={openRef}
                onDrop={e => dropHandler(e)}
                radius={"md"}
                maxSize={30 * 1024 ** 2}
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                className={styles.dropzone}
            >
                <div style={{ pointerEvents: 'all' }}>
                    <Group position={'center'}>
                        <Dropzone.Idle>
                            <IconWorldUpload
                                size={60}
                                stroke={1.5}
                                color={"#C1C2C5"}
                            />
                        </Dropzone.Idle>

                        <Dropzone.Accept>
                            <IconCloudDownload
                                size={60}
                                stroke={1.5}
                                color="#12b886"
                            />
                        </Dropzone.Accept>

                        <Dropzone.Reject>
                            <IconX
                                size={60}
                                stroke={1.5}
                                color={"#fa5252"}
                            />
                        </Dropzone.Reject>
                    </Group>

                    <Text
                        size={"xl"}
                        align={"center"}
                        mt={"xl"}
                        weight={500}
                    >
                        <Dropzone.Idle>Upload Image</Dropzone.Idle>
                        <Dropzone.Accept>Drop image here</Dropzone.Accept>
                        <Dropzone.Reject>Please upload image files less than 30 mb</Dropzone.Reject>
                    </Text>

                    <Text
                        align='center'
                        mt={"xs"}
                        color={"dimmed"}
                    >
                        Drag&drop {imagesPopover} here to upload. We can only accept files that are less than
                        30mb in size.
                    </Text>
                </div>
            </Dropzone>

            <Button
                className={styles.control}
                size={"lg"}
                radius={"md"}
                onClick={() => openRef.current?.()}
                color={"indigo"}
            >
                Upload Image
            </Button>
        </div>
    )

    //drop handler
    function dropHandler(files: FileWithPath[]) {
        if(files.length === 0)
            return
        
        let file = files[0]
        let loadState = {
            title: file.name,
            size: file.size / (1024 ** 2),
            loadingPercent: 20
        } as ImageLoadState

        setImageLoad({ ...loadState })

        //load the file into data
        let reader = new FileReader()
        reader.readAsDataURL(file)

        loadState.loadingPercent = 50
        setImageLoad({ ...loadState })

        reader.onload = function() {
            loadState.loadingPercent = 80
            setImageLoad({ ...loadState })

            let result = reader.result
            if(result === null)
                return

            let imgSrc = result.toString()
            let imgLoad = new globalThis.Image()
            imgLoad.src = imgSrc

            imgLoad.onload = function() {
                let width = imgLoad.width
                let height = imgLoad.height
                loadState.loadingPercent = 100

                setDims({ x: width, y: height })
                setImageLoad({ ...loadState })
                setLoadedImage(imgSrc)
            }
        }
    }

    //reset the loaded image function
    function resetImage() {
        setImageLoad(null)
        setLoadedImage(null)
        setDims(null)
    }

    //create image
    function createImage() {
        if(loadedImage === null)
            return
        
        let imageData = {} as ICreateMediaBlockData
        imageData.imageData = loadImage(loadedImage)
        if(dims !== null) {
            imageData.width = dims.x
            imageData.height = dims.y
        }

        createBlock("image", imageData)
        close()
    }

    return (
        <div>
            <Modal
                opened={active}
                onClose={() => { close() }}
                size={"lg"}
                withCloseButton={false}
                title={"Upload Image"}
                exitTransitionDuration={200}
                centered
            >
                {loadedImage === null
                    ? dropView
                    : imageView
                }

                {imageLoad !== null && (
                    <div>
                        <div className={styles.loadingPanel}>
                            <ThemeIcon
                                variant={'light'}
                                color={'indigo'}
                                size={'lg'}
                                mt={imageLoad.loadingPercent === 100 ? -12.5 : -17.5}
                            >
                                <IconPhoto />
                            </ThemeIcon>

                            <div style={{ flexGrow: 1, }}>
                                <Group position='apart'>
                                    <Text
                                        weight={'bold'}
                                        size={'md'}
                                        sx={{ lineHeight: 1 }}
                                    >
                                        {imageLoad.title}
                                    </Text>

                                    <ActionIcon
                                        size={'xs'}
                                        variant={'subtle'}
                                        onClick={() => { resetImage() }}
                                    >
                                        <IconX size={13} />
                                    </ActionIcon>
                                </Group>

                                <Text
                                    size={'sm'}
                                    color={'dimmed'}
                                >
                                    {imageLoad.size.toFixed(2)}mb
                                </Text>

                                {imageLoad.loadingPercent !== 100 && (
                                    <Progress 
                                        radius={'xl'}
                                        color={'cyan'}
                                        value={imageLoad.loadingPercent}
                                        striped
                                        animate
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <Group position='center' pt={20}>
                    <Button
                        size={'lg'}
                        radius={'md'}
                        color={'red'}
                        variant={'outline'}
                        onClick={() => { close() }}
                        sx={{ width: 120 }}
                    >
                        Cancel
                    </Button>

                    <Button
                        size={'lg'}
                        radius={'md'}
                        color={'indigo'}
                        sx={{ width: 120 }}
                        disabled={loadedImage === null ? true : false}
                        onClick={() => { createImage() }}
                    >
                        Upload
                    </Button>
                </Group>
            </Modal>
        </div>
    )
}

export default CreateImageModal