import React, { useEffect, useState } from 'react'

import { 
    Modal,
    Group,
    Button,
    useMantineTheme 
} from '@mantine/core'

import PreviewView from './views/preview_view'
import TextView    from './views/text_view'

const ModalView = ({ opened, setOpened }) => {
    const theme                   = useMantineTheme()
    const [selected, setSelected] = useState([])
    const [state, setState]       = useState(true)

    //title information
    const [title, setTitle]             = useState("Chart Preview")
    const [description, setDescription] = useState("Indicators: ")

    function AddObject(object) {
        let n_selected = selected

        n_selected.push(object)
        setSelected([...n_selected])
    }

    function RemoveObject(id) {
        let n_selected = []
        for(let i = 0; i < selected.length; i++) {
            let obj = selected[i]
            if(obj.id == id)
                continue

            n_selected.push(obj)
        }

        setSelected([...n_selected])
    }

    function ParseText(text, setter) {
        if(setter == "title")
            setTitle(text)
        if(setter == "description")
            setDescription(text)
    }

    useEffect(() => {
        if(state == true)
            setSelected([])
    }, [state])
    
    return (
        <Modal
            overlayColor={theme.colors.dark[9]}
            overlayOpacity={0.55}
            overlayBlur={3}
            opened={opened}
            onClose={() => { setOpened(false) }}
            size={"55%"}
            title={"Select Indicators"}
            centered
        >
            {state
                ? (
                    <PreviewView
                        AddObject={AddObject}
                        RemoveObject={RemoveObject}
                        selected={selected}
                    />
                )
                : (
                    <TextView 
                        selected={selected}
                        title={title}
                        description={description}
                        ParseText={ParseText}
                    />  
                )
            }

            <Group position={'center'} mt={"xl"}>
                <Button 
                    sx={{ width: 100 }}
                    disabled={state}
                    onClick={() => { setState(true) }}
                >
                    Previous
                </Button>

                <Button 
                    sx={{ width: 100 }}
                    disabled={selected.length == 0}
                    onClick={() => { 
                        if(state == true)
                            setState(false) 
                    }}
                >
                    {state
                        ? "Next"
                        : "Add"
                    }
                </Button>
            </Group>
        </Modal>
    )
}

export default ModalView