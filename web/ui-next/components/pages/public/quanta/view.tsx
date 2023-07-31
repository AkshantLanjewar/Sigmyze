import { Container, Group, Stack, Tabs, Text, ThemeIcon, Title } from "@mantine/core";
import { IconArrowLeft, IconAtom2, IconBinaryTree2, IconBuildingBank } from "@tabler/icons";
import Link from "next/link";
import { memo } from "react";
import PublicIndicatorsPanel from "./tabs/public-indicators";
import PublicNodeView from "./tabs/public-node-view";

interface IViewProps {
    datasetId: string,
    datasetTitle: string | undefined,
    internalId: string | undefined,
    description: string | undefined
    
}

const PublicQuantaPageView: React.FC<IViewProps> = memo(({ datasetId, datasetTitle, internalId, description }) => (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Container 
            p={"md"}
            px={"xl"}
            mt={"md"}
            mb={"md"}
            fluid={true}
            sx={{ width: "100%" }}
        >
            <Link href={"/datasets"} >
                <Group 
                    position={"left"} 
                    align={"center"} 
                    spacing={2.5}
                    p={0}
                >
                    <IconArrowLeft size={18} color="#3b5bdb" />

                    <Text size={"sm"} weight={"bold"} color={"indigo"}>Go Back to Datasets!</Text>
                </Group>
            </Link>

            <Group
                position={"left"}
                align={"flex-start"}
                spacing={"xl"}
                mt={"xl"}
                p={0}
            >
                <ThemeIcon
                    size={64}
                    color={"red"}
                    mt={8}
                >
                    <IconAtom2 width={48} height={48} />
                </ThemeIcon>

                <Stack spacing={"lg"}>
                    <Stack spacing={5}>
                        <Title order={2}>
                            {datasetTitle
                                ? datasetTitle
                                : "Dataset Title"
                            }
                        </Title>

                        <Title order={6}>
                            {internalId
                                ? internalId
                                : "Dataset ID"
                            }
                        </Title>
                    </Stack>

                    <Text size={"sm"} color={"dimmed"} style={{ maxWidth: 500 }}>
                        {description
                            ? description
                            : "Dataset Description"
                        }
                    </Text>
                </Stack>
            </Group>
        </Container>

        <div style={{ flexGrow: 1, display: 'flex', width: "100%" }}>
            <Tabs
                color={"red"}
                radius={"xs"}
                keepMounted={false}
                defaultValue={"indicators"}
                sx={{
                    height: '100%',
                    width: "100%",
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                }}
            >
                <Tabs.List px={0}>
                    <Tabs.Tab
                        value="indicators"
                        icon={<IconBuildingBank />}
                    >
                        Indicators
                    </Tabs.Tab>

                    <Tabs.Tab
                        value="create-dataset"
                        icon={<IconBinaryTree2 stroke={"2"} />}
                    >
                        Fetch Indicators
                    </Tabs.Tab>

                    <Tabs.Tab
                        value="update-dataset"
                        icon={<IconBinaryTree2 stroke={"2"} />}
                    >
                        Update Dataset
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel
                    value={"indicators"}
                    sx={{ flexGrow: 1, backgroundColor: "#101113" }}
                >
                    <PublicIndicatorsPanel datasetId={datasetId} />
                </Tabs.Panel>

                <Tabs.Panel
                    value={"create-dataset"}
                    sx={{ flexGrow: 1 }}
                >
                    <PublicNodeView datasetId={datasetId} editorType="get" />
                </Tabs.Panel>

                <Tabs.Panel
                    value={"update-dataset"}
                    sx={{ flexGrow: 1 }}
                >
                    <PublicNodeView datasetId={datasetId} editorType="update" />
                </Tabs.Panel>
            </Tabs>
        </div>
    </div>
))

export default PublicQuantaPageView