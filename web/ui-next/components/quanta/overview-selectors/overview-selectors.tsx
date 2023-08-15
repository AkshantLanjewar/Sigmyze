import { ActionIcon, Text, Tooltip } from '@mantine/core'
import { IconCode, IconCodePlus } from '@tabler/icons'
import { useContext } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import OverviewSelector from './overview-selector'
import styles from './overview-selectors.module.scss'
import { QuantaUIContextData } from '../../data/quanta/ui-context'
import { IQuantaUIState } from '../../data/quanta/ui-context/state'

/**
 * Here will be all the documentation relating to the tests required to successfully test the overview
 * selectors components
 * 
 * Unit Tests:
 *      OverviewSelectors (mount)
 *      OverviewSelectors (dummy selector data)
 * 
 * E2E Test:
 *      - click on create-selector button
 *      - validate resulting form
 *      - selector-name = Selector Name
 *      - selector-id = Selector Id
 * 
 * Selectors Locators:
 *      - selector-name = Selector Name input component
 *      - selector-id = Selector Id input component
 *      - selector-container = Selectors container
 *      - create-selector-button = Create Selector Button
 */

const OverviewSelectors: React.FC = ({ }) => {
    const quantaContext = useContext(QuantaContextData) as IQuantaState
    const { openModal } = useContext(QuantaUIContextData) as IQuantaUIState
    const selectors = quantaContext.selectors
    
    return (
        <div className={styles.selectors__view} data-testId={"selector-container"}>
            {selectors?.map((step) => (
                <OverviewSelector selector={step} />
            ))}

            <div className={styles.selector__item}>
                <Tooltip
                    label={"Create Selector"}
                    position={"bottom"}
                    withArrow
                    styles={{ tooltip: { backgroundColor: "#08090A" } }}
                >
                    <ActionIcon 
                        className={styles.selector__icon} 
                        onClick={() => openModal("new_selector")}
                        radius={"md"}
                        data-testId={"create-selector-button"}
                    >
                        <IconCodePlus size={48} stroke={"2"} />

                        <Text size={"md"} mt={"sm"}>
                            Create Selector
                        </Text>
                    </ActionIcon> 
                </Tooltip>  
            </div>
        </div>
    )
}

export default OverviewSelectors