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

const routes = [
    { icon: IconHome2, label: 'Home', path: '/' },
    { icon: IconDatabase, label: 'Datasets', path: '/datasets' },
    { icon: IconGlobe, label: 'Lunar', path: '/lunar' },
    { icon: IconZoomQuestion, label: 'About Us', path: '/about' },
    { icon: IconNews, label: 'Blog', path: '/blog' }
]

interface NavbarProps {
    location: string
}

const NavbarS: React.FC<NavbarProps> = ({ location  }) : JSX.Element => {
    const links = routes.map((link, index) => (
        <Tooltip 
            label={link.label} 
            position={'right'}
            withArrow
        >
            <UnstyledButton
                onClick={() => { window.location.assign(link.path) }}
                sx={(theme: MantineTheme) => ({
                    width: 50,
                    height: 50,
                    borderRadius: theme.radius.md,

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.dark[0],

                    '&:hover': {
                        backgroundColor: link.path === location ? theme.colors.indigo[6] : theme.colors.dark[5]
                    },

                    backgroundColor: link.path === location ? theme.colors.indigo[6] : 'transparent'
                })}
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