import React from 'react'
import Head  from 'next/head'

import { 
    AppShell,
    MantineProvider 
} from '@mantine/core'

//layout components
import NavbarS from './static/navbar'
import HeaderS from './static/header'
import UserContext from './data/user/context'
import { NotificationsProvider } from '@mantine/notifications'

interface LayoutProps {
    title: string,
    description: string,
    location: string,
    children: JSX.Element | never[]
}

const DefaultLayout: React.FC<LayoutProps> = ({ title, description, location, children }) : JSX.Element => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <UserContext>
                <MantineProvider 
                    withGlobalStyles
                    withNormalizeCSS
                    withCSSVariables 
                    theme={{ 
                        colorScheme: 'dark',
                        colors: {
                            light: [
                                "#C1C2C5",
                                "#A6A7AB",
                                "#909296",
                                "#5c5f66",
                                "#373A40",
                                "#2C2E33",
                                "#25262b",
                                "#1A1B1E",
                                "#141517",
                                "#101113"
                            ]
                        },
                        fontFamily: 'Poppins'
                    }}
                >
                    <NotificationsProvider>
                        <AppShell
                            padding={0}
                            navbar={<NavbarS location={location} />}
                            header={<HeaderS />}
                            styles={(theme: any) => ({
                                main: { backgroundColor: theme.colors.dark[7] }
                            })}
                        >
                            {children}
                        </AppShell>
                    </NotificationsProvider>
                </MantineProvider>
            </UserContext>
        </>
    )
}

export default DefaultLayout