import React, { SetStateAction } from "react"
import { ITableHeader, ITableRow } from "."
import styles from './index.module.scss'
import { ScrollArea, Table } from "@mantine/core"
import { v4 } from "uuid"
import SparkView from "../../ui/visualization/spark-view"

interface IViewProps {
    headers: ITableHeader[],
    rows: ITableRow[],
    setScrolled: (value: SetStateAction<boolean>) => void
}

const View: React.FC<IViewProps> = React.memo(({ headers, rows, setScrolled }) => {
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
})

export default View