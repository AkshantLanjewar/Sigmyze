import { Popover, Group, Button, Text } from "@mantine/core"
import { FileWithPath, Dropzone, MIME_TYPES } from "@mantine/dropzone"
import { useDisclosure } from "@mantine/hooks"
import { IconWorldUpload, IconCloudDownload, IconX } from "@tabler/icons"
import { RefObject } from "react"
import styles from './index.module.scss'

interface IDropviewProps {
    /**
     * Open ref for the dropzone
     */
    openRef: RefObject<() => void>,

    /**
     * This is the function that handles when an item is selected in the dropzone
     */
    dropHandler: (files: FileWithPath[]) => void
}

const Dropview: React.FC<IDropviewProps> = ({ openRef, dropHandler }) => {
    //whether or not the popover is opened
    const [popoverOpened, popoverHandlers] = useDisclosure(false)

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

    return (
        <div className={styles.dropzone__wrapper} data-testId={'upload-input'}>
            <Dropzone
                openRef={openRef}
                onDrop={e => dropHandler(e)}
                radius={"md"}
                maxSize={30 * 1024 ** 2}
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                className={styles.dropzone}
            >
                <div style={{ pointerEvents: "all" }}>
                    <Group position={"center"}>
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
                data-testId={'upload-image-btn'}
            >
                Upload Image
            </Button>
        </div>
    )
}

export default Dropview