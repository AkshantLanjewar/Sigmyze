import React, { useRef, useState, useEffect } from 'react'

import ImageDropdzone from '../../../ui/image-dropzone'
import { 
    Group,
    Modal,
    Button,
    Image,
    useMantineTheme 
} from '@mantine/core'

import { MIME_TYPES } from '@mantine/dropzone'
import { 
    ImageSize,
    ImageBase64 
}  from '../../../lib'

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
        ImageBase64(file, setImageURL)
    }, [file])

    let dropzone = (
        <ImageDropdzone
            openRef={openRef}
            onDrop={onDropHandler}
            accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.gif, MIME_TYPES.svg]}
            maxSize={30 * 1024 ** 2}
        />
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