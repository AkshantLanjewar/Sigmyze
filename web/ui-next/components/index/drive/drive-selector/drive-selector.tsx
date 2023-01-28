import { Group, Menu, UnstyledButton } from "@mantine/core"
import { IconChevronDown, IconFileShredder } from "@tabler/icons"
import { useContext, useState } from "react"
import { OrganizationContextData } from "../../../data/organization/context"
import { IOrganization, IOrganizationController } from "../../../data/organization/types"
import styles from './drive-selector.module.scss'

interface IDriveSelectorProps {
    organizationBlock: IOrganization
}

const DriveSelector: React.FC<IDriveSelectorProps> = ({ organizationBlock }) => {
    const [opened, setOpened] = useState(false)

    const { 
        organizations,
        setOrganization 
    } = useContext(OrganizationContextData) as IOrganizationController

    return (
        <div>
            <Menu
                opened={opened}
                onChange={setOpened}
                radius={"sm"}
                position={"bottom-start"}
                transition={"slide-down"}
                offset={5}
                width={250}
                withArrow
            >
                <Menu.Target>
                    <UnstyledButton className={`${styles.control} ${opened && styles.opened}`}>
                        <Group 
                            spacing={"xs"} 
                            noWrap
                            style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            <IconFileShredder size={18} />
                            
                            <span className={styles.label}>
                                <span>{organizationBlock.organization_name}</span>
                            </span>
                        </Group>

                        <IconChevronDown
                            size={16}
                            className={`${styles.icon} ${opened && styles.opened}`}
                        />
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    {organizations && organizations.map((step) => (
                        <Menu.Item
                            icon={<IconFileShredder size={18} />}
                            component={"button"}
                            onClick={() => { setOrganization(step.organization_id) }}
                        >
                            {step.organization_name}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}

export default DriveSelector