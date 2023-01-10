import { createRef, useEffect } from "react"
import LunarChartBuilder from "./option-builder"

interface ISparkLineProps {
    data: any[],
    labels: string[],
    disableTooltip?: boolean
}

const SparkLine: React.FC<ISparkLineProps> = ({ data, labels, disableTooltip }): JSX.Element => {
    const ref = createRef<HTMLCanvasElement>()

    function BuildChart() {
        ref.current!.innerHTML = ""
        let chartBuilder = new LunarChartBuilder()

        chartBuilder.ClearData()
        chartBuilder.SetLabels(labels)

        //handle datasets
        for(let i = 0; i < data.length; i++) {
            let dataset    = data[i]
            let identifier = dataset['label']
            let r_data     = dataset['data']

            chartBuilder.AddDataset(identifier, r_data)
            chartBuilder.SetLabel(identifier, identifier) 
            chartBuilder.SetDatasetPointStyle(identifier, false)
        }

        chartBuilder.AddScale("x")
        chartBuilder.SetScaleDisplay("x", false)

        chartBuilder.AddScale("y")
        chartBuilder.SetScaleDisplay("y", false)

        chartBuilder.SetPadding(10)
        chartBuilder.SetLegendDisplay(false)

        if(disableTooltip === true)
            chartBuilder.SetTooltipsEnabled(false)

        chartBuilder.Render(ref.current!, disableTooltip)
    }

    useEffect(() => {
        BuildChart()
    }, [])

    useEffect(() => {
        BuildChart()
    }, [data])

    return (
        <>
            <div style={{ width: '100%', height: '100%' }}>
                <canvas ref={ref}></canvas>
            </div>
        </>
    )
}

export default SparkLine