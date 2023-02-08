import DefaultLayout from "../components/default-layout"
import IndexPage from "../components/index"
import Footer from "../components/nav-elements/footer"

export default function Home() {
	return (
		<>
			<DefaultLayout
				title="Sigmyze"
				description=""
				location="/"
			>
				<div style={{ width: '100%', height: '100%' }}>
					<IndexPage />
					<Footer />
				</div>
			</DefaultLayout>
		</>
	)
}
