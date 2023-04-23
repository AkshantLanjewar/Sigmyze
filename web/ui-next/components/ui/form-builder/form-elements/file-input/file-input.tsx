import { ActionIcon, Stack, Group, LoadingOverlay, Tooltip } from '@mantine/core'
import { IconPlus, IconCode, IconBraces, IconX, IconEdit } from '@tabler/icons'
import { useEffect, useRef, useState } from 'react'
import styles from './file-input.module.scss'

interface IFileInputProps {
    fileType?: string,
    fileName?: string,
    setValue?: (val: any) => void
}

const FileInput: React.FC<IFileInputProps> = ({ fileType, fileName, setValue }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [name, setName] = useState<string | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [loaded, setLoaded] = useState(false)
    const [loader, setLoader] = useState(false)
    const [fileUploaded, setFileUploaded] = useState(false)

    useEffect(() => {
        if(fileType === undefined || fileName === undefined)
            return

        setName(fileName)
        setType(`.${fileType}`)
        setLoaded(true)
    }, [fileType, fileName])

    function openFileInput() {
        if(inputRef.current === null)
            return

        inputRef.current.click()
    }

    function fileChange(e: React.ChangeEvent<HTMLInputElement>) {
        let files = e.target.files
        if(files === null)
            return
        if(setValue === undefined)
            return

        setLoader(true)
        let file = files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = function() {
            let result = reader.result
            if(result === null)
                return

            let data = result.toString().split(',')[1]
            setValue(data)
            setFileUploaded(true)
            setLoader(false)
        }
    }

    function editFile() {
        if(setValue === undefined)
            return

        setValue(null)
        setFileUploaded(false)
    }

    return (
        <div className={styles.file__item}>
            <LoadingOverlay
                visible={loader}
                overlayBlur={2}
                color={"cyan"}
            />

            {loaded && (
                <Tooltip
                    position={'top-start'}
                    label={"Upload File"}
                    openDelay={200}
                    styles={{ tooltip: { backgroundColor: "#08090A" } }}
                    transition={"slide-down"}
                    offset={10}
                >
                    <div className={styles.file__inner}>
                        <input
                            className={styles.file__input}
                            type={"file"}
                            ref={inputRef}
                            onChangeCapture={fileChange}
                            accept={type}
                        />

                        <ActionIcon
                            color={'violet'}
                            size={'xl'}
                            variant={fileUploaded ? 'filled' : 'outline'}
                            radius={"md"}
                            sx={{ borderWidth: 2, zIndex: 3 }}
                            onClick={() => openFileInput()}
                        >
                            {fileUploaded
                                ? <IconBraces size={28} stroke={"2"} color={"#d0bfff"} />
                                : <IconPlus size={28} stroke={"2"} color={"#d0bfff"} />
                            }
                        </ActionIcon>

                        <Stack spacing={0}>
                            <div className={styles.file__name}>{name}</div>

                            <Group spacing={2.5}>
                                <IconCode size={14} color={"#d0bfff"} />
                                <div className={styles.file__type}>{type} file</div>
                            </Group>
                        </Stack>
                    </div>
                </Tooltip>
            )}

            {fileUploaded && (
                <Group align={'center'}>
                    <Tooltip
                        withArrow
                        position={'bottom'}
                        label={"Edit File"}
                        openDelay={200}
                        styles={{ tooltip: { backgroundColor: "#08090A" } }}
                        transition={"slide-down"}
                    >
                        <ActionIcon
                            color={"dark"}
                            variant={"filled"}
                            onClick={() => editFile()}
                        >
                            <IconEdit size={14} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            )}
        </div>
    )
}

export default FileInput