import { Button, Group, Menu } from "@mantine/core"
import { IconLink } from "@tabler/icons"
import { RESERVED_LINKS } from "./reserved-links"
import { NodeCreateMenuInner } from "../../quanta-editor/node/node-create-menu"
import { v4 } from "uuid"
import { useContext, useEffect, useState } from "react"
import { SelectorPaneContextData } from "../context"
import { ISelectorPaneState } from "../context/types"

interface IPipelineLinkerProps {
    pipelineId: string
}

const PipelineLinker: React.FC<IPipelineLinkerProps> = ({ pipelineId }) => {
    const [reserved, setReserved] = useState<string | undefined>(undefined)
    const { pipelineLinks, setPipelineLink } = useContext(SelectorPaneContextData) as ISelectorPaneState

    useEffect(() => {
        let linked = undefined
        let linkKeys = Object.keys(pipelineLinks)

        for(let i = 0; i < linkKeys.length; i++) {
            let key = linkKeys[i]
            let val = pipelineLinks[key]

            if(val === pipelineId)
                linked = key
        }

        setReserved(linked)
    }, [pipelineLinks])
    
    return (
        <Menu
            shadow="md"
            width={200}
            withArrow
            position={'bottom-end'}
        >
            <Menu.Target>
                {reserved
                    ? (
                        <Button
                            style={{ height: 26 }}
                            size={'xs'}
                            radius={'xl'}
                            variant={'outline'}
                            color={"indigo"}
                        >
                            {reserved}
                        </Button>
                    )
                    : (
                        <Button
                            style={{ height: 26 }}
                            size={'xs'}
                            radius={'xl'}
                            variant={'outline'}
                            color={"green"}
                        >
                            <Group spacing={2.5}>
                                <IconLink size={16} stroke={2} />
                                <span>Reserve Object</span>
                            </Group>
                        </Button>
                    )
                }
            </Menu.Target>

            <Menu.Dropdown>
                {RESERVED_LINKS.map((step) => {
                    const onClick = () => {
                        setPipelineLink(step.linkName, pipelineId)
                    }
                    
                    return (
                        <NodeCreateMenuInner
                            key={v4()}
                            name={step.linkName}
                            description={step.linkDescription}
                            icon={step.icon}
                            onClick={onClick}
                        />
                    )
                })}
            </Menu.Dropdown>
        </Menu>
    )
}

export default PipelineLinker