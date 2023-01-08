import { 
    useState, 
    useEffect,
    createRef,
    KeyboardEvent 
} from "react"

import Image from "next/image"

import { 
    UnstyledButton,
    Group,
    Text,
    Modal,
    TextInput,
    ScrollArea,
    Stack,
    Button, 
    MantineNumberSize
} from "@mantine/core"

import styles from './object-search.module.scss'
import { IconSearch } from "@tabler/icons"

import { IDatasetObject } from "../data/datasets/DatasetsTypes"

interface IObjectSearchProps {
    objects?: Array<IDatasetObject>,
    submitFunc?: Function,
    useModal: boolean,
    submitButton?: boolean
    setSelected?: Function,
    type?: string
}

interface SelectedState {
    value: boolean,
    object: IDatasetObject,
}

const ObjectSearch: React.FC<IObjectSearchProps> 
    = ({ objects, submitFunc, useModal, submitButton, setSelected, type }): JSX.Element => {
    let defaultSelectedState = { 
        value: false,
        object: {
            object_logo: '',
            object_fullname: ''
        } as IDatasetObject
    }

    const ref = createRef<HTMLInputElement>()

    const [objectsV, setObjectsV] = useState<Array<IDatasetObject>>([])
    const [opened, setOpened]     = useState(false)
    
    const [selectedV, setSelectedV] = useState<SelectedState>(defaultSelectedState)
    const [selectedO, setSelectedO] = useState<SelectedState>({
        value: false,
        object: {
            object_logo: objects![0] ? objects![0].object_logo : '',
            object_fullname: objects![0] ? objects![0].object_fullname : ''
        } as IDatasetObject
    })

    useEffect(() => {
        setObjectsV(objects!)
    }, [])

    useEffect(() => {
        setObjectsV(objects!)
    }, [objects])

    useEffect(() => {
        if(opened === false)
            return
        
        setSelectedV(defaultSelectedState)
    }, [opened])

    function onKeyUp(e: KeyboardEvent<HTMLInputElement>) {
        e.preventDefault()
        
        let cInput = ref.current!.value.toLowerCase()
        let steps  = []
        for(let i = 0; i < objects!.length; i++) {
            let object = objects![i]

            let sub    = object.object_fullname.substring(0, cInput.length).toLowerCase()
            if(cInput == sub)
                steps.push(object)
        }

        setObjectsV([...steps])
    }

    function SetSelected(object: IDatasetObject) {
        setSelectedV({
            value: true,
            object: object
        })

        if(setSelected !== undefined)
            setSelected({
                value: true,
                object: object
            })
    }

    function Submit() {
        setSelectedO({ ...selectedV })
        setOpened(false)

        if(submitFunc)
            submitFunc(selectedV)
    }

    let layout = (
        <div>
            <TextInput
                icon={<IconSearch size={18} />}
                placeholder='Search Objects in Dataset'
                autoFocus
                className={styles.input}
                onKeyUp={onKeyUp}
                ref={ref}
            />

            <div>
                <div className={styles.objects}>
                    <ScrollArea style={{ height: "55vh" }}>
                        <Stack style={{ gap: 0 }}>
                            {objectsV.map((step: IDatasetObject) => {
                                let width  = 24
                                if(step.image_size_x !== undefined)
                                    width = step.image_size_x
                                let height = 16
                                if(step.image_size_y !== undefined)
                                    height = step.image_size_y
                                let text_size="md" as MantineNumberSize
                                if(step.text_size !== undefined)
                                    text_size = step.text_size

                                if(type !== "indicators")
                                    return (
                                        <UnstyledButton
                                            className={`${styles.object} ${
                                                step.object_fullname == selectedV.object.object_fullname ? styles.active : ''
                                            }`}
                                            key={`${step.object_id}`}
                                            onClick={() => { SetSelected(step) }}
                                        >
                                            <Group align={"center"}>
                                                <Image
                                                    width={width}
                                                    height={height}
                                                    src={`data:image/svg+xml;base64,${step.object_logo}`}
                                                    alt={""}
                                                />
        
                                                <Text size={text_size}>{step.object_fullname}</Text>
                                            </Group>
                                        </UnstyledButton>
                                    )
                            })}
                        </Stack>
                    </ScrollArea>
                    
                    {submitButton === false
                        ? null
                        : (
                            <Group position="center" mb={"md"}>
                                <Button 
                                    size={'sm'}
                                    disabled={!selectedV.value} 
                                    onClick={() => { Submit() }}
                                >
                                    Submit
                                </Button>
                            </Group>
                        )
                    }
                </div>
            </div>
        </div>
    )

    return (
        <>
            {useModal
                ? (
                    <div>
                        <UnstyledButton 
                            className={styles.search}
                            onClick={() => { setOpened(true) }}
                        >
                            <Group>
                                <Image 
                                    width={24} 
                                    height={16} 
                                    src={`data:image/svg+xml;base64,${selectedO.object.object_logo}`} 
                                    alt={``}
                                />

                                <Text size={"md"}>{selectedO.object.object_fullname}</Text>
                            </Group>
                        </UnstyledButton>

                        <Modal  
                            centered
                            opened={opened}
                            onClose={() => { setOpened(false) }}
                            size={"lg"}
                            withCloseButton={false}
                            sx={(theme) => ({
                                '.mantine-Paper-root': {
                                    padding: 0,
                                    backgroundColor: theme.colors.dark[8]
                                }
                            })}
                        >
                            {layout}
                        </Modal>
                    </div>
                )
                : layout
            }
        </>
    )
}

export type { SelectedState }
export default ObjectSearch