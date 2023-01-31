import { Avatar, Group, Menu, UnstyledButton, Text } from "@mantine/core"
import { IconLogout } from "@tabler/icons"
import { useContext, useEffect, useState } from "react"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import styles from './user-dropdown.module.scss'

const UserDropdown: React.FC = ({ }) => {
    const { 
        authData, 
        userData,
        verified,
        loggedIn, 
        logout,
        fetchUserData 
    } = useContext(UserContextData) as IUserContext

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [initials, setInitials] = useState("")

    function logoutWrapper() {
        let token = authData?.token
        if(token === undefined)
            return
        if(logout === undefined)
            return
        
        logout(token)
    }

    //actual fetch of the user data
    async function fetchUData() {
        let token = authData?.token
        if(token === undefined)
            return
        if(fetchUserData === undefined)
            return

        await fetchUserData(token)
    }

    //hook that handles the grabbing of the userData
    useEffect(() => {
        if(loggedIn !== true)
            return

        if(userData === undefined)
            fetchUData() 
    }, [loggedIn])

    //hook that handles the userData
    useEffect(() => {
        if(userData === undefined || userData.username === undefined) {
            setInitials("")
            setName("")
            setEmail("")
            
            return
        }

        setInitials(userData.username.split(" ").map((n)=>n[0]).join("").toUpperCase())
        setName(userData.username)
        setEmail(userData.email)
    }, [userData])
    
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
                            {initials}
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
                                {initials}
                            </Avatar>

                            <div style={{ overflow: 'hidden', textOverflow: "ellipsis" }}>
                                <Text 
                                    style={{ overflow: 'hidden', textOverflow: "ellipsis" }}
                                    weight={500}
                                >
                                    {name}
                                </Text>

                                <Text
                                    color={"dimmed"}
                                    size={'xs'}
                                    style={{ overflow: 'hidden', textOverflow: "ellipsis" }}
                                >
                                    {email} 
                                </Text>
                            </div>
                        </Group>
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Settings</Menu.Label>

                    <Menu.Item icon={<IconLogout size={14} stroke={1.5} />} onClick={() => { logoutWrapper() }} >
                        <UnstyledButton className={styles.customLabel}>
                            Logout
                        </UnstyledButton>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}

export default UserDropdown