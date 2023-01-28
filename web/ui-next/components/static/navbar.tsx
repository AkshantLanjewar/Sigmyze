import { 
    Navbar,
    Box,
    Group,
    Stack,
    Tooltip,
    UnstyledButton, 
    MantineTheme
} from '@mantine/core'

import { 
    IconHome2,
    IconDatabase,
    IconGlobe,
    IconZoomQuestion,
    IconNews
} from '@tabler/icons'

import { useContext, useEffect, useState } from 'react'
import { UserContextData } from '../data/user/context'
import { IUserContext } from '../data/user/types'
import DriveNavbar from './drive-navbar/drive-navbar'
import styles from './navbar.module.scss'

const defaultRoutes = [
    { icon: IconHome2, label: 'Home', path: '/' },
    { icon: IconDatabase, label: 'Datasets', path: '/datasets' },
    { icon: IconGlobe, label: 'Lunar', path: '/lunar' },
    { icon: IconZoomQuestion, label: 'About Us', path: '/about' },
    { icon: IconNews, label: 'Blog', path: '/blog' }
]

interface NavbarProps {
    location: string
}

const NavbarS: React.FC<NavbarProps> = ({ location }) : JSX.Element => {
    const { loggedIn } = useContext(UserContextData) as IUserContext
    const [routes, setRoutes] = useState(defaultRoutes)

    useEffect(() => {
        if(loggedIn === true)
        {  
            let nRoutes = []
            for(let i = 0; i < defaultRoutes.length; i++)
            {
                let route = defaultRoutes[i]
                if(route.label === "Home")
                    continue
                nRoutes.push(route)
            }
            setRoutes([ ...nRoutes ])
        }
        else
            setRoutes([ ...defaultRoutes ])
    }, [loggedIn])

    const links = routes.map((link, index) => (
        <Tooltip 
            label={link.label} 
            position={'right'}
            withArrow
        >
            <UnstyledButton
                onClick={() => { window.location.assign(link.path) }}
                className={`${styles.actionButton} ${link.path === location ? styles.active : null}`}
            >
                <link.icon stroke={2} />
            </UnstyledButton>
        </Tooltip>
    ))

    return (
        <Navbar width={{ base: 80 }}>
            <Group sx={{ height: '100%' }}>
                <Box  
                    p={"md"}
                    sx={(theme) => ({ width: 80, backgroundColor: theme.colors.dark[9], height: '100%' })}
                >
                    <Navbar.Section grow mt={15}>
                        <DriveNavbar />

                        <Stack justify={"center"} spacing={10}>
                            {links}
                        </Stack>
                    </Navbar.Section>

                    <Navbar.Section>

                    </Navbar.Section>
                </Box>

                <Box mt={15} sx={{ display: 'none' }}>
                </Box>
            </Group>
        </Navbar>
    )
}

export default NavbarS