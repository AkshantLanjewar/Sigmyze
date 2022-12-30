import React from 'react'
import Head  from 'next/head'

import { 
    AppShell,
    MantineProvider 
} from '@mantine/core'

//layout components
import NavbarS from './static/navbar'
import HeaderS from './static/header'

interface LayoutProps {
    title: string,
    description: string,
    children: JSX.Element | never[]
}

const DefaultLayout: React.FC<LayoutProps> = ({ title, description, children }) : JSX.Element => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <MantineProvider theme={{ 
				colorScheme: 'dark',
				colors: {
					dark: [
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
			}}>
                <AppShell
                    padding={"md"}
                    navbar={<NavbarS />}
                    header={<HeaderS />}
                    styles={(theme) => ({
                        main: { backgroundColor: theme.colors.dark[8] }
                    })}
                >
                    {children}
                </AppShell>
            </MantineProvider>
        </>
    )
}

export default DefaultLayout