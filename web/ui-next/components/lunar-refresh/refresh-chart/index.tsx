import { useEffect } from "react"

interface IRefreshChartProps {
    /**
     * This is the fileId of the chart. 
     * Used to retreive data from the data context.
     */
    fileId: string
}

const RefreshChart: React.FC<IRefreshChartProps> = ({ fileId }) => {
    /**
     * This is the effect that handles the loading of the fileData based on the fileId
     */
    useEffect(() => {

    }, [fileId])

    return (
        <div data-testId={"refresh-chart"}>

        </div>
    )
}

export default RefreshChart