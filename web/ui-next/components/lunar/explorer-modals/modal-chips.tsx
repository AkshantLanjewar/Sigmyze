import { Chip } from '@mantine/core'
import { useEffect, useState } from 'react'
import { IIndicator } from '../../data/datasets/DatasetsTypes'
import styles from './modal-chips.module.scss'

interface IModalChipsProps {
    indicator: IIndicator
}

const ModalChips: React.FC<IModalChipsProps> = ({ indicator }) => {
    const [chips, setChips] = useState([] as JSX.Element[])

    function buildChips() {
        let nChips = []
        if(indicator.dataset !== undefined) {
            let datasetChip = (
                <Chip
                    color={"teal"}
                    variant={"filled"}
                    checked={true}
                    onClick={() => { }}
                >
                    {indicator.dataset}
                </Chip>
            )

            nChips.push(datasetChip)
        }

        if(indicator.object !== undefined) {
            let objectChip = (
                <Chip
                    color={"indigo"}
                    variant={"filled"}
                    checked={true}
                >
                    {indicator.object.object_fullname}
                </Chip>
            )

            nChips.push(objectChip)
        }

        return nChips
    }

    useEffect(() => {
        let nChips = buildChips()
        setChips([ ...nChips ])
    }, [])

    useEffect(() => {
        let nChips = buildChips()
        setChips([ ...nChips ])
    }, [indicator])
    
    return (
        <div className={styles['chips-container']}>
            {chips}
        </div>
    )
}

export default ModalChips