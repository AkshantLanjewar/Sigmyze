import { memo, useContext, useEffect, useState } from "react";
import { GetOrganizationDatasets, GetPublicDatasets, IDatasetCard } from "../../../data/quanta/dataset-api";
import { IRawFragmentTemplateProps } from "../../../ui/multi-form/types";
import { UserContextData } from "../../../data/user/context";
import { IUserContext } from "../../../data/user/types";
import { useRouter } from "next/router";
import { Card, CardSection, SimpleGrid, Text } from "@mantine/core";
import styles from '../../../../pages/datasets/datasets.module.scss'
import { IconAtom2 } from "@tabler/icons";

interface IDatasetOutput {
    datasetId: string
}

interface IViewProps {
    cards: IDatasetCard[],
    activeValue: string | undefined,
    setSelected: (payload: string) => void
}

const View: React.FC<IViewProps> = memo(({ cards, activeValue, setSelected }) => (
    <SimpleGrid 
        p={"sm"}
        cols={4}
        breakpoints={[
            { maxWidth: 1000, cols: 3 },
            { maxWidth: 755, cols: 2 },
            { maxWidth: 500, cols: 1 },
        ]}
    >
        {cards.map((step) => (
            <Card
                radius={"md"}
                className={styles.card}
                sx={(theme) => ({ border: (activeValue === step.datasetId && activeValue !== undefined) ? `2px solid ${theme.colors.indigo[7]}` : 'none' })}
                onClick={() => {
                    if(step.datasetId === undefined)
                        return

                    let output: IDatasetOutput = { datasetId: step.datasetId }
                    let outputString = JSON.stringify(output)
                    setSelected(outputString)
                }}
            >
                <CardSection className={styles.imageWrapper}>
                    <IconAtom2 width={"3em"} height={"3em"} />
                </CardSection>

                <Text mt={"sm"} weight={"bold"}>{step.datasetName}</Text>
                <Text className={styles.description} size={"xs"}>{step.datasetId?.toLowerCase()}</Text>
            </Card>
        ))}
    </SimpleGrid>
))

const DatasetFormStep: React.FC<IRawFragmentTemplateProps> = ({ activeValue, setSelected }) => {
    const [cards, setCards] = useState<IDatasetCard[]>([])
    const [activeDataset, setActiveDataset] = useState<string | undefined>(undefined)

    const router = useRouter()
    const { authData } = useContext(UserContextData) as IUserContext

    //we want to be able to see if the active datasetId applies
    useEffect(() => {
        if(activeValue === undefined)
            return

        let outputParsed: IDatasetOutput = JSON.parse(activeValue)
        if(outputParsed.datasetId === undefined)
            return
        
        setActiveDataset(outputParsed.datasetId)
    }, [activeValue])

    //we want to grab all the datasets for the organization id
    useEffect(() => {
        async function main() {
            let token = authData?.token
            let skipOrganization = false
            let queriedIds = router.query.ids as string[] | undefined

            if(token === undefined)
                skipOrganization = true
            if(queriedIds === undefined || queriedIds.length !== 2)
                skipOrganization = true

            //grab the organizationId datasets
            let newCards: IDatasetCard[] = []
            if(skipOrganization === false) {
                let organizationId = queriedIds![0]
                let collectedDatasets = await GetOrganizationDatasets(token!, organizationId)
                if(collectedDatasets === undefined)
                    return

                newCards = [ ...newCards, ...collectedDatasets ]
            }

            //grab all the public datasets
            let publicDatasets = await GetPublicDatasets()
            if(publicDatasets === undefined)
                return

            newCards = [ ...newCards, ...publicDatasets ]
            setCards([ ...newCards ])
        }

        main()
    }, [authData])

    return <View cards={cards} activeValue={activeDataset} setSelected={setSelected} />
}

export type { IDatasetOutput }
export default DatasetFormStep