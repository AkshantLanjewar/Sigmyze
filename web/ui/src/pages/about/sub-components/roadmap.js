import React from "react";

import {
    Stack,
    Group,
    Card,
    ThemeIcon,
    createStyles
} from "@mantine/core"

import { AiFillDatabase } from 'react-icons/ai'

import './roadmap.scoped.scss'

const useStyles = createStyles((themes) => ({
    textStack: {
        gap: 0,
        width: "calc(100% - 55px)"
    },

    cardWidth: {
        width: "30%",
        height: "140px"
    },

    stackSpacing: {
        gap: 0,
        marginBottom: "2rem"
    },

    icon: {
        backgroundColor: themes.colors.dark[3]
    },

    alignGroup: {
        alignItems: "center",
        height: "100%"
    }
}))

const RoadmapCard = ({ title, desc, icon }) => {
    const { classes } = useStyles()

    return (
        <Card radius={"md"} pt={"lg"} pb={"xl"} pr={"lg"} pl={"lg"} className={classes.cardWidth}>
            <Group spacing={"sm"} className={classes.alignGroup}>
                <ThemeIcon radius={"xl"} size={"xl"} className={classes.icon}>
                    {icon}
                </ThemeIcon>

                <Group direction={"column"} className={classes.textStack}>
                    <h6 className="card-title">{title}</h6>
                    <p className="card-desc">
                        {desc}
                    </p>
                </Group>
            </Group>
        </Card>
    )
}

const Roadmap = ({  }) => {
    const { classes } = useStyles()

    return (
        <div className="roadmap">
            <Stack spacing={"sm"} className={classes.stackSpacing}>
                <div className="node">
                    <div className="time">
                        <p>Near Future</p>
                    </div>

                    <Group spacing={"md"}>
                        <RoadmapCard 
                            title={"World Bank Data"}
                            desc={"Integrating the world bank dataset into our hosted datasets"}
                            icon={ <AiFillDatabase /> }
                        />

                        <RoadmapCard 
                            title={"Custom Data"}
                            desc={"Ability to bring your own data to our charting"}
                            icon={ <AiFillDatabase /> }
                        />

                        <RoadmapCard 
                            title={"Blog"}
                            desc={"Add a blog to encourage easier communication"}
                            icon={ <AiFillDatabase /> }
                        />
                    </Group>
                </div>

                <div className="node">
                    <div className="time">
                        <p>Far Future</p>
                    </div>

                    <Group spacing={"md"}>
                        <RoadmapCard 
                            title={"World Bank Data"}
                            desc={"Integrating the world bank dataset into our hosted datasets"}
                            icon={ <AiFillDatabase /> }
                        />

                        <RoadmapCard 
                            title={"World Bank Data"}
                            desc={"Integrating the world bank dataset into our hosted datasets"}
                            icon={ <AiFillDatabase /> }
                        />

                        <RoadmapCard 
                            title={"World Bank Data"}
                            desc={"Integrating the world bank dataset into our hosted datasets"}
                            icon={ <AiFillDatabase /> }
                        />
                    </Group>
                </div>
            </Stack>
        </div>
    )
}

export default Roadmap