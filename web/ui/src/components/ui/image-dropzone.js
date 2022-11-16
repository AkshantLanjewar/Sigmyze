import React from 'react'

import { Dropzone } from '@mantine/dropzone'
import { 
    Box,
    Group,
    Text,
    useMantineTheme 
} from '@mantine/core'

import { 
    BsFillCloudDownloadFill,
    BsXLg,
    BsFillCloudUploadFill 
} from 'react-icons/bs'

const ImageDropdzone = ({ openRef, onDrop, accept, maxSize }) => {
    const theme   = useMantineTheme()

    return (
        <Dropzone
            openRef={openRef}
            onDrop={onDrop}
            accept={accept}
            maxSize={maxSize}

            sx={{
                borderWidth: 1,
                paddingBottom: 50,
                background: theme.colors.dark[7]
            }}
        >
            <Box sx={{ pointerEvents: 'none' }}>
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
            </Box>
        </Dropzone>
    )
}

export default ImageDropdzone