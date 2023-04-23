import { Avatar, Group, Menu, UnstyledButton, Text } from "@mantine/core"
import { IconLogout } from "@tabler/icons"
import { useContext, useEffect, useState } from "react"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"
import styles from './user-dropdown.module.scss'

/**
 * @description
 *  this is the user dropdown for when the user is logged in 
 * @returns user dropdown
 */
const UserDropdown: React.FC = ({ }) => {
    const { 
        authData, 
        userData,
        verified,
        loggedIn, 
        logout,
        fetchUserData 
    } = useContext(UserContextData) as IUserContext

    /**
     * @state
     * @description
     *  this is the email for the user, collected in fetchUData
     */
    const [email, setEmail] = useState("")

    /**
     * @state
     * @description
     *  this is the name for the user, collected in fetchUData
     */
    const [name, setName] = useState("")

    /**
     * @state
     * @description
     *  this is the initials after the name is collected
     */
    const [initials, setInitials] = useState("")

    /**
     * @function
     * @description
     *  this is the function that logs the user out
     */
    function logoutWrapper() {
        let token = authData?.token
        if(token === undefined)
            return
        if(logout === undefined)
            return
        
        logout(token)
    }

    /**
     * @function
     * @description
     *  this is the function that fetches the user data
     */
    async function fetchUData() {
        let token = authData?.token
        if(token === undefined)
            return
        if(fetchUserData === undefined)
            return

        await fetchUserData(token)
    }

    /**
     * @effect
     * @description
     *  this effect fetches the user data
     * @params
     *  function executes when loggedIn and authData change
     */
    useEffect(() => {
        if(loggedIn !== true)
            return

        if(userData === undefined)
            fetchUData() 
    }, [loggedIn, authData])

    /**
     * @effect
     * @description
     *  this is the function that updates the internal state,
     *  whenever the userdata updates
     */
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