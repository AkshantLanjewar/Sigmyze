import { 
    Navbar,
    Box,
    Group,
    Stack,
    Tooltip,
    UnstyledButton 
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
    { icon: IconDatabase, label: 'Indicators', path: '/indicators' },
    { icon: IconGlobe, label: 'Lunar', path: '/lunar' },
    { icon: IconZoomQuestion, label: 'About Us', path: '/about' },
    { icon: IconNews, label: 'Blog', path: '/blog' }
]

interface NavbarProps {

}

const NavbarS: React.FC<NavbarProps> = ({  }) : JSX.Element => {
    const links = routes.map((link, index) => (
        <Tooltip 
            label={link.label} 
            position={'right'}
            withArrow
        >
            <UnstyledButton
                onClick={() => {  }}
                sx={(theme) => ({
                    width: 50,
                    height: 50,
                    borderRadius: theme.radius.md,

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.dark[0],

                    '&:hover': {
                        backgroundColor: theme.colors.dark[5]
                    }
                })}
            >
                <link.icon stroke={1.5} />
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