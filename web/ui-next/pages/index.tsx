import { GetServerSidePropsContext } from "next/types"
import { GetDatasets, GetIndicators, GetObjects } from "../components/data/datasets/DatasetsAPI"
import { IIndicator } from "../components/data/datasets/DatasetsTypes"
import IndexPage from "../components/pages/index/index"
import ApplicationLayout from "../components/nav-elements/application-layout"
import { DefaultIndicatorTable } from "./lunar"
import Script from "next/script"

export default function Home(props: any) {
	return (
		<>
			<ApplicationLayout
				title="Sigmyze"
				description=""
				location="/"
				protectedView={false}
				darken={true}
			>
				<div style={{ width: '100%', height: '100%' }}>
					<IndexPage indicators={props.indicators} />

					<Script src="https://www.googletagmanager.com/gtag/js?id=G-5H0YHQRSPE" />
					<Script id="google-analytics">
						{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
				
						gtag('config', 'GA_MEASUREMENT_ID');
						`}
					</Script>
				</div>
			</ApplicationLayout>
		</>
	)
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const datasets = await GetDatasets()
	let indicator_pool = [] as IIndicator[]

	for(let i = 0; i < datasets.datasets.length; i++) {
		let dataset = datasets.datasets[i]
		let objects = await GetObjects(dataset.name)
		const default_object = DefaultIndicatorTable[dataset.name.toLowerCase() as keyof typeof DefaultIndicatorTable]
        const indicators = await GetIndicators(dataset.name, default_object)
		if(objects.objects === undefined || objects.objects === null)
			continue

		for(let x = 0; x < objects.objects.length; x++) {
			let object = objects.objects[x]

			for(let z = 0; z < indicators.indicators.length; z++) {
				let indicator = indicators.indicators[z]
				let indicator_ = {} as IIndicator
				indicator_.dataset = dataset.name
				indicator_.indicator = indicator
				indicator_.object = object

				indicator_pool.push(indicator_)
			}
		}
	}

	const shuffled = indicator_pool.sort(() => 0.5 - Math.random())
	let selected = shuffled.slice(0, 25)

	return {
		props: {
			indicators: selected
		}
	}
}