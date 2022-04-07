import React from "react"

import {
    Paper,
    Text,
    SimpleGrid,
    TextInput,
    Box,
    Textarea,
    Group,
    Button,
    createStyles
} from '@mantine/core'

import { MdOutlineAlternateEmail } from 'react-icons/md'
import { HiLocationMarker }        from 'react-icons/hi'
import { BsFillSunFill }           from 'react-icons/bs'

const useStyles = createStyles((theme) => {
    const BREAKPOINT = theme.fn.smallerThan('sm')

    return {
        wrapper: {
            display: 'flex',
            backgroundColor: theme.colors.dark[8],
            borderRadius: theme.radius.md,
            padding: 4,
            border: `1px solid ${theme.colors.dark[8]}`,
            [BREAKPOINT]: {
                flexDirection: 'column'
            }
        },

        form: {
            boxSizing: 'border-box',
            flex: 1,
            padding: theme.spacing.xl,
            paddingLeft: theme.spacing.xl * 2,
            borderLeft: 0,

            [BREAKPOINT]: {
                padding: theme.spacing.md,
                paddingLeft: theme.spacing.md
            }
        },

        fields: {
            marginTop: -12
        },

        fieldInput: {
            flex: 1,

            '& + &': {
                marginLeft: theme.spacing.md,

                [BREAKPOINT]: {
                    flexDirection: 'column'
                }
            }
        },

        contacts: {
            boxSizing: 'border-box',
            position: 'relative',
            borderRadius: theme.radius.lg - 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid transparent',
            padding: theme.spacing.xl,
            flex: '0 0 280px',

            [BREAKPOINT]: {
                marginBottom: theme.spacing.sm,
                paddingLeft: theme.spacing.md,
            }
        },

        title: {
            marginBottom: theme.spacing.xl * 1.5,
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,

            [BREAKPOINT]: {
                marginBottom: theme.spacing.xl,
            }
        },

        control: {
            [BREAKPOINT]: {
                flex: 1
            }
        },

        iconWrapper: {
            display: 'flex',
            alignItems: 'center',
            color: theme.white,
        },

        icon: {
            marginRight: theme.spacing.md,
            backgroundImage: 'none',
            backgroundColor: 'transparent'
        },

        iconTitle: {
            color: theme.colors[theme.primaryColor][0]
        },

        description: {
            color: theme.white
        }
    }
})

const CONTACT_FIELDS = [
    { title: 'Email',         description: "sigmyze@gmail.com", icon: <MdOutlineAlternateEmail size={24} /> },
    { title: 'Location',      description: "Fremont, CA",       icon: <HiLocationMarker size={24} /> },
    { title: 'Working Hours', description: "4pm - 8pm (PST)",   icon: <BsFillSunFill size={24} /> }
]

const ContactIcon = ({ icon, title, description }) => {
    const { classes } = useStyles()

    return (
        <div className={classes.iconWrapper}>
            <Box mr="md">
                {icon}
            </Box>

            <div>
                <Text size="xs" className={classes.iconTitle}>
                    {title}
                </Text>
                <Text className={classes.description}>{description}</Text>
            </div>
        </div>
    )
}

function ContactIconsList({ data = CONTACT_FIELDS }) {
    const items = data.map((item, index) => <ContactIcon key={index} {...item} />)
    return <Group direction={"column"}>{items}</Group>
}

const ContactForm = ({  }) => {
    const { classes } = useStyles()

    function SubmitForm(e) {
        e.preventDefault()
    }

    return (
        <Paper shadow={"md"} radius={"lg"}>
            <div className={classes.wrapper}>
                <div className={classes.contacts}>
                    <Text size="lg" weight={700} className={classes.title} sx={{ color: '#fff' }}>
                        Contact information
                    </Text>

                    <ContactIconsList />
                </div>

                <form className={classes.form} onSubmit={SubmitForm}>
                    <Text size="lg" weight={700} className={classes.title}>
                        Get in touch
                    </Text>

                    <div className={classes.fields}>
                        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                            <TextInput label="Your name" placeholder="Your name" required />
                            <TextInput label="Your email" placeholder="hello@sigmyze.com" required />
                        </SimpleGrid>

                        <TextInput mt="md" label="Subject" placeholder="Subject" required />

                        <Textarea
                            mt="md"
                            label="Your message"
                            placeholder="Please include all relevant information"
                            minRows={3}
                        />

                        <Group position="right" mt={"md"}>
                            <Button type="submit" className={classes.control}>
                                Send message
                            </Button>
                        </Group>
                    </div>
                </form>
            </div>
        </Paper>
    )
}

export default ContactForm