import DefaultLayout from "../../../components/default-layout"
import { 
    useEffect,
    useState 
} from 'react'

import { useRouter }                 from "next/router"
import { GetServerSidePropsContext } from "next"

import { Carousel } from "@mantine/carousel"
import { 
    Container,
    Stack,
    Title,
    Text,
    Tabs,
    SimpleGrid 
} from "@mantine/core"

import { 
    IDatasetsTable,
    DatasetsTable 
} from "../../../components/data/datasets/DatasetsAPI"

import { 
    IObjectIndicator,
    IIndicator 
} from "../../../components/data/datasets/DatasetsTypes"

import { SelectedState }  from "../../../components/object-search/object-search"
import ObjectSearch       from "../../../components/object-search/object-search"
import ChartCard          from "../../../components/chart-card/chart-card"
import { IDatasetObject } from "../../../components/data/datasets/DatasetsTypes"

import { 
    GetObjects,
    GetDatasets,
    GetCategories,
    GetIndicators 
} from "../../../components/data/datasets/DatasetsAPI"

import { 
    IconInfinity,
    IconBuildingBank,
    IconUser,
    IconTimeline,
    IconCash,
    IconShip 
} from "@tabler/icons"

interface IDatasetPageProps {
    objects?: Array<IDatasetObject>,
    categories?: Array<string>,
    indicators?: Array<IObjectIndicator>
}

interface CategoryTabs {
    category: string,
    icon: JSX.Element
}

const ICON_TABLE = {
    GovtFinance: <IconBuildingBank />,
    People: <IconUser />,
    GDP: <IconTimeline />,
    Investment: <IconCash />,
    Trade: <IconShip />
}

const DefaultIndicatorTable = {
    weo: "USA"
}

const DatasetPage: React.FC<IDatasetPageProps> = ({ objects, categories, indicators }): JSX.Element => {
    const [carousel, setCarousel]             = useState<Array<IIndicator>>([])
    const [displayIndicators, setIndicators]  = useState<Array<IIndicator>>([])
    const [categoryTabs, setCategoryTabs]     = useState<Array<CategoryTabs>>([])
    const [tabValue, setTabValue]             = useState<string | null>(null)
    const [selectedObject, setSelectedObject] = useState<SelectedState>({
        value: false,
        object: {
            object_logo: objects![0].object_logo,
            object_fullname: objects![0].object_fullname
        } as IDatasetObject
    })

    const router  = useRouter()
    const dataset = router.query.dataset as string

    function BuildCharts() {
        let nIndicators = [] as Array<IIndicator>
        let object_id   = objects![0]
        for(let i = 0; i < objects!.length; i++)
            if(objects![i].object_fullname === selectedObject.object.object_fullname)
                object_id = objects![i]

        for(let i = 0; i < indicators!.length; i++) {
            let indicator   = indicators![i]
            let n_indicator = {} as IIndicator
            
            n_indicator.dataset      = dataset.toUpperCase()
            n_indicator.object       = object_id
            n_indicator.indicator    = indicator

            nIndicators.push(n_indicator)
        }

        setIndicators([ ...nIndicators ])
    }

    useEffect(() => {
        let nCategories = [{ category: "All", icon: <IconInfinity /> }] as Array<CategoryTabs>
        for(let i = 0; i < categories!.length; i++) {
            let category = categories![i]
            nCategories.push({
                category: category,
                icon: ICON_TABLE[category as keyof typeof ICON_TABLE]
            })
        }
        
        BuildCharts()

        let random_objects    = []
        let random_indicators = []
        for(let i = 0; i < 3 * 3; i++) {
            random_indicators.push(indicators![Math.floor(Math.random() * indicators!.length)])
            random_objects.push(objects![Math.floor(Math.random() * objects!.length)])
        }

        let carouselCards = []
        for(let i = 0; i < random_objects.length; i++) {
            let object    = random_objects[i]
            let indicator = random_indicators[i]

            let card = {} as IIndicator

            card.dataset   = dataset.toUpperCase()
            card.object    = object
            card.indicator = indicator
            carouselCards.push(card)
        }
        
        setCarousel([ ...carouselCards ])
        setCategoryTabs([...nCategories])
        setTabValue(nCategories[0].category)
    }, [])

    useEffect(() => {
        BuildCharts()
    }, [selectedObject])

    return (
        <>
            <DefaultLayout
                title="Sigmyze Dataset"
                description=""
                location="/datasets"
            >
                <div>
                    <Container mt={"xl"} pt={"xl"}>
                        <Stack pt={"xl"} align={"center"} pb={"xl"}>
                            <Title>{DatasetsTable[dataset as keyof IDatasetsTable]}</Title>
                            <Text size={"lg"}>Explore Indicators in this dataset</Text>
                        </Stack>

                        <Carousel
                            withIndicators
                            height={275}
                            slideSize={"33.333333333%"}
                            slideGap={"md"}
                            breakpoints={[
                                { maxWidth: 'md', slideSize: '50%' },
                                { maxWidth: 'sm', slideSize: '100%', slideGap: 0 },
                            ]}
                            loop
                            align={"start"}
                            slidesToScroll={3}
                            mt={"lg"}
                        >
                            {carousel.length === 0 && ( <Carousel.Slide /> )}
                            {carousel.map((step) => {
                                return (
                                    <Carousel.Slide>
                                        <div>
                                            <ChartCard indicator={step} />
                                        </div>
                                    </Carousel.Slide>
                                )
                            })}
                        </Carousel>

                        <Title mt={"lg"} order={5} align={"center"}>Sample of Indicators from this set</Title>
                    </Container>

                    <Container size={"xl"}>
                        <Stack
                            align={"center"}
                            spacing={"xs"}
                            mt="xl"
                            pt="xl"
                            mb="lg"
                        >
                            <ObjectSearch 
                                objects={objects}
                                submitFunc={setSelectedObject}
                            />

                            <Tabs
                                variant={'pills'}
                                mt={'sm'}
                                value={tabValue}
                                onTabChange={setTabValue}
                                sx={{ width: '85%' }}
                            >
                                <Tabs.List sx={{ justifyContent: 'center' }}>
                                    {categoryTabs.map((step: CategoryTabs) => (
                                        <Tabs.Tab value={step.category} icon={step.icon}>
                                            {step.category}
                                        </Tabs.Tab>
                                    ))}
                                </Tabs.List>

                                {categoryTabs.map((step: CategoryTabs) => (
                                    <Tabs.Panel
                                        value={step.category}
                                        pt={'xs'}
                                    >
                                        <SimpleGrid
                                            cols={4} 
                                            mt={"lg"} 
                                            mb={"xl"}
                                        >
                                            {displayIndicators.map((pStep) => {
                                                if(step.category === "All" || pStep.indicator.category === step.category)
                                                    return (
                                                        <div>
                                                            <ChartCard indicator={pStep} />
                                                        </div>
                                                    )
                                            })}
                                        </SimpleGrid>
                                    </Tabs.Panel>
                                ))}
                            </Tabs>
                        </Stack>
                    </Container>
                </div>
            </DefaultLayout>
        </>
    )
}

export async function getStaticPaths() {
    const data     = await GetDatasets()
    const datasets = data.datasets

    let paths = []
    for(let i = 0; i < datasets.length; i++)
        paths.push({ params: { dataset: datasets[i].name } })
    return {
        paths: paths,
        fallback: false
    }
}

export async function getStaticProps(context: GetServerSidePropsContext) {
    const dataset = context.params!.dataset as string

    const objects    = await GetObjects(dataset)
    const categories = await GetCategories(dataset)
    const indicators = await GetIndicators(dataset, DefaultIndicatorTable[dataset.toLowerCase() as keyof typeof DefaultIndicatorTable])

    return {
        props: {
            objects: objects.objects,
            categories: categories.categories,
            indicators: indicators.indicators
        }
    }
}

export default DatasetPage