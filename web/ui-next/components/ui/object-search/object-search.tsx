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
    MantineNumberSize,
    GroupPosition
} from "@mantine/core"

import styles from './object-search.module.scss'
import { IconSearch } from "@tabler/icons"

import { IDatasetObject } from "../../data/datasets/DatasetsTypes"
import ChartSpark from "../../chart-spark/chart-spark"

interface IObjectSearchProps {
    objects?: Array<IDatasetObject>,
    submitFunc?: Function,
    useModal: boolean,
    submitButton?: boolean
    setSelected?: Function,
    type?: string,
    chips?: JSX.Element
}

interface SelectedState {
    value: boolean,
    object: IDatasetObject,
}

const ObjectSearch: React.FC<IObjectSearchProps> 
    = ({ objects, submitFunc, useModal, submitButton, setSelected, type, chips }): JSX.Element => {
    let defaultSelectedState = { 
        value: false,
        object: {
            object_logo: '',
            object_fullname: ''
        } as IDatasetObject
    }

    const ref = createRef<HTMLInputElement>()

    const [objectsI, setObjectsI] = useState<Array<IDatasetObject>>([])
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
        setObjectsI([])
    }, [objects])

    useEffect(() => {
        if(opened === false)
            return
        
        setSelectedV(defaultSelectedState)
    }, [opened])

    function DeleteObjectEntry(id: string) {
        let nObjects = objectsI
        for(let i = 0; i < objectsV.length; i++) {
            let object = objectsV[i]
            if(object.object_id === id)
                nObjects.push(object)
        }

        setObjectsI([ ...nObjects ])
    }

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

            {chips && (
                <div>
                    {chips}
                </div>
            )}

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
                                let text_weight = "normal"
                                if(step.text_weight !== undefined)
                                    text_weight = step.text_weight
                                let position = "left" as GroupPosition
                                if(step.text_position !== undefined)
                                    position = step.text_position

                                let testIgnore = false
                                for(let i = 0; i < objectsI.length; i++) {
                                    let object = objectsI[i]
                                    if(object.object_id === step.object_id)
                                        testIgnore = true
                                }

                                if(testIgnore === true)
                                    return null

                                if(type !== "indicators")
                                    return (
                                        <UnstyledButton
                                            className={`${styles.object} ${
                                                step.object_fullname == selectedV.object.object_fullname ? styles.active : ''
                                            }`}
                                            key={`${step.object_id}`}
                                            onClick={() => { SetSelected(step) }}
                                        >
                                            <Group align={"center"} position={position}>
                                                {step.hideLogo === true
                                                    ? null
                                                    : (
                                                        <Image
                                                            width={width}
                                                            height={height}
                                                            src={`data:image/svg+xml;base64,${step.object_logo}`}
                                                            alt={""}
                                                        />
                                                    )
                                                }

                                                <div className={styles.textWrapper}>
                                                    <Text 
                                                        size={text_size} 
                                                        weight={text_weight}
                                                    >
                                                        {step.object_fullname}
                                                    </Text>
                                                </div>

                                                {step.sparkline === true
                                                    ? (
                                                        <div>
                                                            <ChartSpark 
                                                                indicator={step.indicator!} 
                                                                id={step.object_id}
                                                                checks={["deleteIfEmpty"]}
                                                                deleteEntry={DeleteObjectEntry}
                                                            />
                                                        </div>
                                                    )
                                                    : null
                                                }
                                            </Group>
                                        </UnstyledButton>
                                    )
                            })}
                        </Stack>
                    </ScrollArea>
                    
                    {submitButton === false
                        ? null
                        : (
                            <Group position="center" mb={"md"} mt={"md"}>
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