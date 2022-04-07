import { MantineProvider } from '@mantine/core'

import { useState, useEffect } from 'react';

//importing the prebuilt-components from our library
import AppShell from "./components/app/shell/shell";
import Navbar   from "./components/composite/navbar/navbar";
import Sidenav  from "./components/composite/sidenav/sidenav";

//redux
import { connect } from 'react-redux'

//import wrapper
import Container from './pages/container'

//import the Logo
import Logo from './assets/logo.svg'

//importing icons for the URLS
import { 
	AiFillHome,
	AiOutlineQuestionCircle
} from 'react-icons/ai'

const pages = [
	{ url: '/',      name: 'Homepage', icon: <AiFillHome />, 		      active: true },
	{ url: '/about', name: 'About',    icon: <AiOutlineQuestionCircle />, active: false }
]

function App() {
	const [navState, setNavState] = useState([])
	useEffect(() => {
		let path 	  = window.location.pathname
		let pNavState = []

		for(let i = 0; i < pages.length; i++) {
			let page = pages[i]
			page['active'] = false

			if(page.url == path)
				page['active'] = true
			pNavState.push(page)
		}

		setNavState([...pNavState])
	}, [])

	return (
		<div>
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
				<AppShell>
					<AppShell.Side>
						<Sidenav>
							<Sidenav.Brand image={Logo} text={"Sigmyze"} />

							<Sidenav.Nav>
								{navState.map((step) => (
									<Sidenav.Nav.Element url={step.url} active={step.active} icon={step.icon} pName={step.name} key={`navbar-${step.name}`} />
								))}
							</Sidenav.Nav>
						</Sidenav>
					</AppShell.Side>

					<AppShell.Main>
						<Navbar />
						<Container />
					</AppShell.Main>
				</AppShell>
			</MantineProvider>
		</div>
	);
}

export default connect()(App);
