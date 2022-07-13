import React from "react"

import useStyles from "../blog.styles"
import {
    Card,
    Image,
    Badge,
    Text,
    Group,
    Avatar,
    ActionIcon,
    useMantineTheme
} from '@mantine/core'

import SigmyzeLogo from '../../../assets/logo.svg'

import { AiOutlineShareAlt } from 'react-icons/ai'

function Article({ image }) {
    const { classes } = useStyles()
    const theme       = useMantineTheme()

    return (
        <Card p={"lg"} radius={"sm"} className={classes.articleCard} shadow={"md"}>
            <Card.Section mb={"sm"}>
                <Image src={image} height={180} />
            </Card.Section>

            <Badge 
                color={"teal"} 
                radius={"sm"} 
                variant={"outline"}
            >
                Dev Update
            </Badge>

            <Text weight={700} className={classes.articleTitle} mt={"xs"}>
                Some cool new feature that we are introducing
            </Text>

            <Group mt={"lg"}>
                <Avatar src={SigmyzeLogo} radius={"sm"} size={"md"} />

                <div>
                    <Text weight={500}>Sigmyze Team</Text>
                    <Text size={"xs"} color={"dimmed"}>
                        Posted July 12, 2022
                    </Text>
                </div>
            </Group>

            <Card.Section className={classes.articleFooter}>
                <Group position="apart">
                    <Text size={"xs"} color={"dimmed"}></Text>

                    <Group spacing={0}>
                        <ActionIcon>

                        </ActionIcon>

                        <ActionIcon>
                            
                        </ActionIcon>

                        <ActionIcon>
                            <AiOutlineShareAlt size={16} color={theme.colors.blue[6]} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Card.Section>
        </Card>
    )
}

export default Article