//importing the prebuilt-components from our library
import AppShell from "./components/app/shell/shell";
import Navbar   from "./components/composite/navbar/navbar";
import Sidenav  from "./components/composite/sidenav/sidenav";

//import the Logo
import Logo from './assets/logo.svg'

//importing icons for the URLS
import { AiFillHome } from 'react-icons/ai'

function App() {
	return (
		<div>
			<AppShell>
				<AppShell.Side>
					<Sidenav>
						<Sidenav.Brand image={Logo} text={"Sigmyze"} />

						<Sidenav.Nav>
							<Sidenav.Nav.Element active={true} icon={<AiFillHome />} pName={"Homepage"} />
						</Sidenav.Nav>
					</Sidenav>
				</AppShell.Side>

				<AppShell.Main>
					<Navbar />
				</AppShell.Main>
			</AppShell>
		</div>
	);
}

export default App;
