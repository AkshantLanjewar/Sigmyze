import IndexPage from "../components/index"
import ApplicationLayout from "../components/nav-elements/application-layout"
import Footer from "../components/nav-elements/footer"

export default function Home() {
	return (
		<>
			<ApplicationLayout
				title="Sigmyze"
				description=""
				location="/"
				protectedView={false}
			>
				<div style={{ width: '100%', height: '100%' }}>
					<IndexPage />
					<Footer />
				</div>
			</ApplicationLayout>
		</>
	)
}
