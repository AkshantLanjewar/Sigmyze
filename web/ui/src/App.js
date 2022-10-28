import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

import { useState, useEffect } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Homepage    from './pages/homepage/homepage'
import About       from './pages/about/about'
import Resources   from './pages/indicators/indicators'
import Dataset     from './pages/dataset/dataset'
import LunarCharts from './pages/lunar-charts/lunar-charts'
import Blog 	   from './pages/blog/blog';

import VerifyModal from './components/user-button/verify-modal/verify-modal'
import AuthModal   from './components/user-button/auth-modal/auth-modal';
import BaseShell   from './BaseShell'

function App({  }) {
	const [navState, setNavState] = useState([])
	useEffect(() => {
		
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
								<Route path="/blog"				 element={ <BaseShell slot={<Blog />} /> } />
							</Routes>
						</BrowserRouter>
				</NotificationsProvider>
			</MantineProvider>
		</div>
	);
}

export default App;
