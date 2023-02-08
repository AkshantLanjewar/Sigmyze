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
import OrganizationContext from './data/organization/context'
import { theme } from './default-theme'

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
                <OrganizationContext>
                    <MantineProvider 
                        withGlobalStyles
                        withNormalizeCSS
                        withCSSVariables 
                        theme={theme}
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
                </OrganizationContext>
            </UserContext>
        </>
    )
}

export default DefaultLayout