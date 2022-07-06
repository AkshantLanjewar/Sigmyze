import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { LunarChart } from 'sigmyze-charting'

const dummyLinearData = [
    {
        date: new Date(1492175218 * 1000),
        value: 12
    },
    {
        date: new Date(1523711218 * 1000), 
        value: 15
    },
    {
        date: new Date(1555247218 * 1000),
        value: 22
    },
    {
        date: new Date(1586869618 * 1000),
        value: 24
    },
    {
        date: new Date(1618405618 * 1000),
        value: 18
    },
    {
        date: new Date(1649941618 * 1000),
        value: 22
    },
]

function ChartTest() {
	const ref = React.createRef()

	useEffect(() => {
		ref.current.innerHTML = ""
		let chart = new LunarChart(1280, 720, ref.current)

		chart.addDataset({ chart_data: dummyLinearData, chart_type: "line" })
		chart.render()
	}, [])

	return (
		<div ref={ref}>

		</div>
	)
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<ChartTest />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
