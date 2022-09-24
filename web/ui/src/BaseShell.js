import React from 'react'
import { useState, useEffect } from 'react'

import { connect } from 'react-redux'

import { ScrollArea } from '@mantine/core'

import AppShell from "./components/app/shell/shell";
import Navbar   from "./components/composite/navbar/navbar";
import Sidenav  from "./components/composite/sidenav/sidenav";

import DriveSidebar from './components/app/shell/drive/drive-sidebar'

import Logo from './assets/logo.svg'

//importing icons for the URLS
import { 
	AiFillHome,
	AiOutlineQuestionCircle,
    AiFillDashboard
} from 'react-icons/ai'

import { BsStack, BsMoonFill, BsNewspaper, BsDisplay } from 'react-icons/bs'

function BaseShell({ slot, user }) {
	const [navState, setNavState] 		= useState([])
	const [driveActive, setDriveActive] = useState(false)

	let pages = [
		{ url: '/',           name: 'Homepage',   icon: <AiFillHome />, 		     active: true },
		{ url: '/indicators', name: 'Indicators', icon: <BsStack />, 		         active: false },
		{ url: '/lunar',      name: 'Lunar',      icon: <BsMoonFill />, 			 active: false },
		{ url: '/about',      name: 'About',      icon: <AiOutlineQuestionCircle />, active: false },
		{ url: '/blog',       name: 'Blog',       icon: <BsNewspaper />, 			 active: false }
	]

	function CheckUserState() {
        let userState = user.userState
        let urlPath   = window.location.pathname

        if(userState == "logged_in" && urlPath == "/")
			setDriveActive(true)
		else
			setDriveActive(false)
    }

	useEffect(() => {
        let userState = user.userState
		let path 	  = window.location.pathname
		let pNavState = []

		for(let i = 0; i < pages.length; i++) {
			let page = pages[i]
			page['active'] = false

			if(page.url == path)
				page['active'] = true
			pNavState.push(page)
		}

        if(userState == "logged_in")
            pNavState[0] = { url: '/', name: 'Dashboard', icon: <AiFillDashboard />, active: pNavState[0].active }

		CheckUserState()		
		setNavState([...pNavState])
	}, [])

	useEffect(() => {
		CheckUserState()
	}, [user])

	return (
		<AppShell>
			<AppShell.Side>
				<Sidenav>
					<Sidenav.Brand image={Logo} text={"Sigmyze"} />

					<Sidenav.Nav>
						{driveActive
							? <DriveSidebar />
							: null
						}

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

const mapStateToProps = state => ({
	user: state.user
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(BaseShell)