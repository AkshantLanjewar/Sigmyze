import React from 'react'

import { 
    Tooltip,
    Menu,
    Text,
    ActionIcon 
} from '@mantine/core'
import useStyles from "../toolbar.styles"

import { BsThreeDots } from 'react-icons/bs'
import { AiOutlineDatabase, AiFillDelete } from 'react-icons/ai'
import { MdOutlineOpenInNew } from 'react-icons/md'

const Layer = ({ openTab, layer, remove_indicator }) => {
    const { classes } = useStyles()

    return (
        <Tooltip
            position={'bottom'}
            withArrow
            label={`${layer.object_id}: ${layer.indicator_name}`} 
            color={"gray"}
        >
            <div className={classes.staticItem}>
                <div className={classes.staticInner}>
                    <div className={classes.staticText}>
                        <span className={classes.leftLine} />
                        <AiOutlineDatabase size={18} style={{ marginLeft: 5 }} />

                        <Text 
                            weight={700} 
                            size="sm"
                            style={{ 
                                paddingTop: 2, 
                                maxHeight: "100%", 
                                overflow: "hidden", 
                                height: 25,
                                display: 'flex',
                                alignItems: 'center' 
                            }}
                        >
                            {layer.indicator_id.toUpperCase()} : {layer.object_id.toUpperCase()}
                        </Text>
                    </div>

                    <Menu shadow={"md"} withArrow position={'bottom-start'} width={175}>
                        <Menu.Target>
                            <ActionIcon 
                                color={'gray'}
                                size="md"
                                sx={{ marginRight: -4 }}
                            >
                                <BsThreeDots />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Charting</Menu.Label>
                            
                            <Menu.Item
                                icon={<AiFillDelete size={14} />}
                                onClick={() => { remove_indicator(layer.object_id.toUpperCase(), layer.indicator_id.toUpperCase()) }}
                            >
                                Delete
                            </Menu.Item>

                            <Menu.Item
                                icon={<MdOutlineOpenInNew size={14} />}
                                onClick={() => { openTab(layer.indicator_id.toUpperCase(), layer.object_id.toUpperCase()) }}
                            >
                                Open Tab
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            </div>
        </Tooltip>
    )
}

//

export default Layer