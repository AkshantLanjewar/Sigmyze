import { AppShell, MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
import Head from "next/head"
import OrganizationContext from "../data/organization/context"
import UserContext from "../data/user/context"
import { theme } from "../default-theme"
import HeaderS from "../static/header"
import NavbarS from "../static/navbar"

enum ApplicationNavbar {
    logged_out,
    logged_in_secure,
    logged_in_default
}

interface IApplicationLayoutProps {
    title: string,
    description: string,
    location: string,
    protectedView: boolean,
    children: React.ReactNode
}

const ApplicationLayout: React.FC<IApplicationLayoutProps> = 
({ title, description, location, protectedView, children }) => {
    let sidebar = undefined
    if(protectedView)
        sidebar = <NavbarS location={location} />

    let header = <HeaderS />

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
                                navbar={sidebar}
                                header={header}
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

export default ApplicationLayout