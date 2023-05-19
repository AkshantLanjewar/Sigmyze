import styles from './index.module.scss'

import { ScrollArea, Table } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { v4 } from 'uuid'
import { QuantaIndicatorManagerData } from '../quanta-indicator-manager'
import { IChartData, IQuantaIndicatorManager } from '../quanta-indicator-manager/types'
import { validateIndicator } from '../quanta-indicator-manager/utils'
import { capitalizeFirstLetter } from '../../data/utils'
import SparkView from '../../ui/visualization/spark-view'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'

interface ITableHeader {
    fieldName: string,
    fieldType: string
}

interface ITableRow {
    items: ITableRowItem[]
}

interface ITableRowItem {
    itemType: string,
    stringValue?: string,
    dateValue?: Date,
    chartValue?: IChartData[]
}

const IndicatorViewer: React.FC = ({ }) => {
    const [scrolled, setScrolled] = useState(false)
    const [rows, setRows] = useState<ITableRow[]>([])
    const [headers, setHeaders] = useState<ITableHeader[]>([])

    const { indicators } = useContext(QuantaIndicatorManagerData) as IQuantaIndicatorManager
    const { toggleUpdateEditorIndicators } = useContext(QuantaContextData) as IQuantaState

    useEffect(() => {
        toggleUpdateEditorIndicators()
    }, [])

    // construct the table from the indicators list we receive
    useEffect(() => {
        //get the basic schema
        if(indicators.length === 0)
            return

        let inital_item = indicators[0]
        if(validateIndicator(inital_item) === false)
            return

        let tableHeaders = [] as ITableHeader[]
        let fields = inital_item.field!.datasetFields!
        for(let i = 0; i < fields.length; i++) {
            let field = fields[i]

            let fieldName = capitalizeFirstLetter(field.fieldKey!)
            let fieldType = field.fieldType!
            tableHeaders.push({ fieldName, fieldType })
        }

        tableHeaders.push({ fieldName: "Chart", fieldType: "chart" })
        setHeaders([ ...tableHeaders ])

        let tableRows = [] as ITableRow[]
        for(let i = 0; i < indicators.length; i++) {
            let indicator = indicators[i]
            let indicatorFields = indicator.field?.datasetFields!
            let indicatorItems = [] as ITableRowItem[]

            for(let x = 0; x < indicatorFields.length; x++) {
                let field = indicatorFields[x]
                let fieldType = field.fieldType!
                let tableItem = {} as ITableRowItem

                tableItem.itemType = fieldType
                switch(tableItem.itemType) {
                    case "string":
                        tableItem.stringValue = field.stringField!
                        break
                    case "date":
                        let timestamp = field.dateField!
                        let date = new Date(timestamp * 1000)
                        tableItem.dateValue = date
                        break
                    default:
                        break
                }

                indicatorItems.push(tableItem)
            }

            let chartData = indicator.chartData!
            indicatorItems.push({ itemType: "chart", chartValue: chartData })
            tableRows.push({ items: indicatorItems })
        }

        setRows([ ...tableRows ])
    }, [indicators])

    return (
        <div className={styles.table__wrapper}>
            <ScrollArea h={435} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                <Table 
                    miw={700} 
                    maw={900}
                    striped
                    highlightOnHover
                    className={styles.table}
                >
                    <thead className={styles.table__header}>
                        <tr className={styles.row}>
                            {headers.map((step) => (
                                <th className={styles.text} key={v4()}>
                                    <span>{step.fieldName}</span>
                                    <span className={styles.muted}>{step.fieldType}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className={styles.body}>
                        {rows.map((step) => (
                            <tr key={v4()}>
                                {step.items.map((step) => {
                                    let internal = <div />
                                    switch(step.itemType) {
                                        case "string":
                                            internal = (<span>{step.stringValue}</span>)
                                            break
                                        case "chart":
                                            if(step.chartValue === undefined)
                                                return

                                            internal = <SparkView data={step.chartValue} />
                                            break
                                        default:
                                            break
                                    }

                                    return (
                                        <td className={styles.table__d}>
                                            {internal}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ScrollArea>
        </div>
    )
}

export default IndicatorViewer