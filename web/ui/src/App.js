import { MantineProvider } from '@mantine/core'

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
	return (
		<div>
			<MantineProvider theme={{ 
				colorScheme: 'dark',
				colors: {
					dark: [
						"#F7FAFC",
						"#EDF2F7",
						"#E2E8F0",
						"#CBD5E0",
						"#A0AEC0",
						"#718096",
						"#4A5568",
						"#2D3748",
						"#1A202C",
						"#171923"
					]
				},
				fontFamily: 'Poppins'
			}}>
				<AppShell>
					<AppShell.Side>
						<Sidenav>
							<Sidenav.Brand image={Logo} text={"Sigmyze"} />

							<Sidenav.Nav>
								{pages.map((step) => (
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
