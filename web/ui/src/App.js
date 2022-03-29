import React, { useState, useEffect } from "react"

import { AppShell, Burger, Header, MediaQuery, Navbar, Text, ColorSchemeProvider, useMantineTheme } from '@mantine/core';
import { Group } from "@mantine/core";
import { Title } from "@mantine/core";
import { Button } from "@mantine/core";

import Logo from './svg/logo.svg'

function TNav(props) {
	const opened = props.opened
	const setOpen = props.setOpen

	return (
		<Header height={60} pl="md" pr="md">
			<Group sx={{ width: "100%", height: "100%" }} position="apart">
				<Group spacing={0}>
					<MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
						<Burger
							opened={opened}
							onClick={() => { setOpen((o) => !o) }}
							size="sm"
							mr="sm" />
					</MediaQuery>

					<Group spacing={10}>
						<img src={Logo} className='mini' alt='Logo' width={"32px"} height={'32px'} />
						<Title order={3}>Lunar</Title>
					</Group>
				</Group>

				<Group>
					<Button size="xs" color={"violet"}> Login </Button>
				</Group>
			</Group>
		</Header>
	)
}

function Sidenav(props) {
	const opened = props.opened
	const theme = useMantineTheme()

	return (
		<Navbar
			p="md"
			hiddenBreakpoint={"sm"}
			hidden={!opened}
			sx={{ backgroundColor: theme.colors.dark[8] }}
			width={{ sm: 250, lg: 300 }}>
			<Navbar.Section>

			</Navbar.Section>
		</Navbar>
	)
}

function App() {
	const [sidenavOpened, setSidenavOpened] = useState(false)
	const theme = useMantineTheme()

	return (
		<div>
			<ColorSchemeProvider colorScheme={"dark"}>
				<AppShell
					navbarOffsetBreakpoint={"sm"}
					fixed
					navbar={<Sidenav opened={sidenavOpened} />}
					header={<TNav opened={sidenavOpened} setOpen={setSidenavOpened} />}
					styles={{
						main: {
							background: theme.colors.dark[8]
						}
					}}
				>
					<Text>Stuff</Text>
				</AppShell>
			</ColorSchemeProvider>
		</div>
	);
}

export default App;
