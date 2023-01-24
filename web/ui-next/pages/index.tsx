import DefaultLayout from "../components/default-layout"
import IndexPage from "../components/index"

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
				</div>
			</DefaultLayout>
		</>
	)
}
