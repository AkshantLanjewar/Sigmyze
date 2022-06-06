import { MantineProvider, ScrollArea } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

import { useState, useEffect } from 'react';

//importing the prebuilt-components from our library
import AppShell from "./components/app/shell/shell";
import Navbar   from "./components/composite/navbar/navbar";
import Sidenav  from "./components/composite/sidenav/sidenav";

//import the Logo
import Logo from './assets/logo.svg'

//importing icons for the URLS
import { 
	AiFillHome,
	AiOutlineQuestionCircle
} from 'react-icons/ai'

import { BsStack, BsMoonFill } from 'react-icons/bs'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Homepage    from './pages/homepage/homepage'
import About       from './pages/about/about'
import Resources   from './pages/indicators/indicators'
import Dataset     from './pages/dataset/dataset'
import LunarCharts from './pages/lunar-charts/lunar-charts';


import VerifyModal from './components/user-button/verify-modal/verify-modal'
import AuthModal   from './components/user-button/auth-modal/auth-modal';

const pages = [
	{ url: '/',           name: 'Homepage',   icon: <AiFillHome />, 		     active: true },
	{ url: '/indicators', name: 'Indicators', icon: <BsStack />, 		         active: false },
	{ url: '/lunar',      name: 'Lunar',      icon: <BsMoonFill />, 			 active: false },
	{ url: '/about',      name: 'About',      icon: <AiOutlineQuestionCircle />, active: false }
]


function BaseShell(props) {
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


	const slot = props.slot

	return (
		<AppShell>
			<AppShell.Side>
				<Sidenav>
					<Sidenav.Brand image={Logo} text={"Sigmyze"} />

					<Sidenav.Nav>
						{navState.map((step) => (
							<Sidenav.Nav.Element 
								url={step.url} 
								active={step.active} 
								icon={step.icon} 
								pName={step.name} 
								key={`navbar-${step.name}`} />
						))}
					</Sidenav.Nav>
				</Sidenav>
			</AppShell.Side>

			<AppShell.Main>
				<Navbar />

				<div className='wrap'>
					<ScrollArea style={{ height: "calc(100vh - 60px)" }}>
						{slot}
					</ScrollArea>
				</div>
			</AppShell.Main>
		</AppShell>
	)
}

function App(props) {
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
				
				<VerifyModal />
				<AuthModal />

				<NotificationsProvider>
						<BrowserRouter>
							<Routes>
								<Route path="/"           		 element={ <BaseShell slot={<Homepage />} /> } />
								<Route path="/about"      		 element={ <BaseShell slot={<About />} /> } />
								<Route path="/indicators" 		 element={ <BaseShell slot={<Resources />} /> } />
								<Route path="/datasets/:dataset" element={ <BaseShell slot={<Dataset />} /> } />
								<Route path="/lunar"	  		 element={ <LunarCharts /> } />
							</Routes>
						</BrowserRouter>
				</NotificationsProvider>
			</MantineProvider>
		</div>
	);
}

export default App;
