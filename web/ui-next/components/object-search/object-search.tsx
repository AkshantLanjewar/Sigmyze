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
    Button 
} from "@mantine/core"

import styles from './object-search.module.scss'
import { IconSearch } from "@tabler/icons"

import { IDatasetObject } from "../data/datasets/DatasetsTypes"

interface IObjectSearchProps {
    objects?: Array<IDatasetObject>,
    submitFunc?: Function
}

interface SelectedState {
    value: boolean,
    object: IDatasetObject
}

const ObjectSearch: React.FC<IObjectSearchProps> = ({ objects, submitFunc }): JSX.Element => {
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
            object_logo: objects![0].object_logo,
            object_fullname: objects![0].object_fullname
        } as IDatasetObject
    })

    useEffect(() => {
        setObjectsV(objects!)
    }, [])

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
                            {objectsV.map((step: IDatasetObject) => (
                                <UnstyledButton
                                    className={`${styles.object} ${
                                        step.object_fullname == selectedV.object.object_fullname ? styles.active : ''
                                    }`}
                                    key={`${step.object_id}`}
                                    onClick={() => { SetSelected(step) }}
                                >
                                    <Group align={"center"}>
                                        <Image
                                            width={24}
                                            height={16}
                                            src={`data:image/svg+xml;base64,${step.object_logo}`}
                                            alt={""}
                                        />

                                        <Text>{step.object_fullname}</Text>
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Stack>
                    </ScrollArea>

                    <Group position="center" mb={"md"}>
                        <Button 
                            size={'sm'}
                            disabled={!selectedV.value} 
                            onClick={() => { Submit() }}
                        >
                            Submit
                        </Button>
                    </Group>
                </div>
            </div>
        </div>
    )

    return (
        <>
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
        </>
    )
}

export type { SelectedState }
export default ObjectSearch