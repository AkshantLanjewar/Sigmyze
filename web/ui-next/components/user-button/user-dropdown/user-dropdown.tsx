import { Avatar, Group, Menu, UnstyledButton, Text } from "@mantine/core"
import { IconLogout } from "@tabler/icons"
import styles from './user-dropdown.module.scss'

const UserDropdown: React.FC = ({ }) => {
    return (
        <div>
            <Menu
                withArrow
                width={250}
                position={'bottom-end'}
                transition={'slide-down'}
                styles={{
                    itemLabel: { overflow: 'hidden' }
                }}
            >
                <Menu.Target>
                    <UnstyledButton className={styles.avatarButton}>
                        <Avatar
                            radius={"sm"}
                            color={'blue'}
                        >
                            AL
                        </Avatar>
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item className={styles.menuItem}>
                        <Group className={styles.userGroup}>
                            <Avatar
                                radius={"sm"}
                                color={'blue'}
                            >
                                AL
                            </Avatar>

                            <div style={{ overflow: 'hidden', textOverflow: "ellipsis" }}>
                                <Text 
                                    style={{ overflow: 'hidden', textOverflow: "ellipsis" }}
                                    weight={500}
                                >
                                    Akshant Lanjewar
                                </Text>

                                <Text
                                    color={"dimmed"}
                                    size={'xs'}
                                    style={{ overflow: 'hidden', textOverflow: "ellipsis" }}
                                >
                                    akshant.lanjewar@gmail.com 
                                </Text>
                            </div>
                        </Group>
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Settings</Menu.Label>

                    <Menu.Item icon={<IconLogout size={14} stroke={1.5} />} >
                        <div className={styles.customLabel}>
                            Logout
                        </div>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}

export default UserDropdown