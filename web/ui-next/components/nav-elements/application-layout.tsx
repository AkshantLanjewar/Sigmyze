import { AppShell, MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
import Head from "next/head"
import OrganizationContext from "../data/organization/context"
import UserContext from "../data/user/context"
import { theme } from "../default-theme"
import Header from "./header"
import Sidebar from "./sidebar/sidebar"

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
    darken?: boolean,
    children: React.ReactNode
}

/**
 * @param title 
 *  this is the title for the page
 * @param description
 *  this is the description for the page
 * @param location
 *  this is the url for the page, ex. /
 * @param protectedView
 *  this is a check to see whether the page is a protected view or not.
 *  if it is a protected view, it will display the sidebar.
 * @param darken
 *  this is the boolean to set the navbar to its darker color or not
 * @description
 *  this is the parent component that manages the base layout for the website
 * @returns web layout (with children)
 */
const ApplicationLayout: React.FC<IApplicationLayoutProps> = 
({ title, description, location, protectedView, darken, children }) => {
    let sidebar = undefined
    if(protectedView)
        sidebar = <Sidebar location={location} />

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
                                header={<Header protectedView={protectedView} darken={darken} />}
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