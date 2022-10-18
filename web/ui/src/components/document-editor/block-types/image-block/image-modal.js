import React, { useRef, useState, useEffect } from 'react'

import { 
    Group,
    Modal,
    Button,
    Text,
    Image,
    useMantineTheme 
} from '@mantine/core'

import { ImageSize } from '../../../lib'

import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { BsFillCloudUploadFill, BsFillCloudDownloadFill, BsXLg } from 'react-icons/bs'

const ModalView = ({ opened, setOpened, file, setFile, submit, setSize, SetAspectWidth }) => {
    const theme   = useMantineTheme()
    const openRef = useRef(null)
    const ref     = React.createRef()

    const [imageURL, setImageURL] = useState(null)

    function onDropHandler(files) {
        let file = files[0]
        setFile(file)
    }

    useEffect(() => {
        let imageUrl = file == null ? null : URL.createObjectURL(file)
        setImageURL(imageUrl)
    }, [file])

    let dropzone = (
        <Dropzone
            openRef={openRef}
            onDrop={onDropHandler}
            radius={"md"}
            accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.gif, MIME_TYPES.svg]}
            maxSize={30 * 1024 ** 2}
            sx={{
                borderWidth: 1,
                paddingBottom: 50,
                background: theme.colors.dark[7]
            }}
        >
            <div style={{ pointerEvents: 'none' }}>
                <Group position={'center'}>
                    <Dropzone.Accept>
                        <BsFillCloudDownloadFill 
                            size={50} 
                            color={theme.colors[theme.primaryColor][6]} 
                            stroke={1.5} 
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <BsXLg 
                            size={50} 
                            color={theme.colors.red[6]} 
                            stroke={1.5} 
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <BsFillCloudUploadFill
                            size={50}
                            color={theme.colors.dark[0]}
                            stroke={1.5}
                        />
                    </Dropzone.Idle>
                </Group>

                <Text align={'center'} weight={700} size={'lg'} mt={'xl'}>
                    <Dropzone.Accept>Drop photo here</Dropzone.Accept>
                    <Dropzone.Reject>Must be of .png, .jpg, .gif, .svg file types</Dropzone.Reject>
                    <Dropzone.Idle>Upload Photo</Dropzone.Idle>
                </Text>
                <Text align={"center"} size={'sm'} mt={'xs'} color={'dimmed'}>
                    Drag&drop photos here to upload. We only accept
                    <i> .png </i>
                    <i>.jpg </i>
                    <i>.gif </i>
                    <i>.svg </i>
                    files that are less than 30mb in size
                </Text>
            </div>
        </Dropzone>
    )

    let nullButton = (
        <Button
            sx={{
                position: 'absolute',
                width: 250,
                height: 50,
                left: 'calc(50% - 125px)',
                top: 'calc(100% - 50px)',
                marginTop: 25
            }}

            size={'md'}
            radius={'xl'}
            onClick={() => { openRef.current?.() }}
        >
            Select Image
        </Button>
    )

    let fileButton = (
        <Group
            sx={{
                position: 'absolute',
                height: 50,
                left: 'calc(50% - 125px)',
                top: 'calc(100% - 50px)',
                marginTop: 25
            }}
            size={'md'}
            radius={'xl'}
        >
            <Button
                color={'indigo'}
                onClick={() => { submit() }}
            >
                Add Image
            </Button>

            <Button
                color={"gray"}
                onClick={() => { setFile(null) }}
            >
                Select Again
            </Button>
        </Group>
    )

    return (
        <Modal
            overlayColor={theme.colors.dark[9]}
            overlayOpacity={0.55}
            overlayBlur={3}
            opened={opened}
            onClose={() => { setOpened(false) }}
            title={"Upload Image"}
            centered
        >
            {file == null
                ? dropzone
                : (
                    <div style={{ minHeight: 250, height: 250, marginBottom: 20 }}>
                        <Image
                            height={250}
                            fit={"contain"}
                            src={imageURL}
                            imageRef={ref}
                            imageProps={{ onLoad: () => { 
                                ImageSize(file, SetAspectWidth, setSize)
                            }}}
                        />
                    </div>
                )
            }

            {file == null
                ? nullButton
                : fileButton
            }
        </Modal>
    )
}

export default ModalView