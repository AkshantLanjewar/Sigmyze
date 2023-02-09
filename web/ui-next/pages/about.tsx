import { Box, Button, Group, Stack, Textarea, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { IconAt, IconCloudComputing, IconDeviceDesktopAnalytics, IconFileAnalytics, IconMapPin, IconSun } from "@tabler/icons"
import { FormEvent } from "react"
import ApplicationLayout from "../components/nav-elements/application-layout"
import Footer from "../components/nav-elements/footer/footer"
import styles from '../styles/info.module.scss'

const AboutPage: React.FC = ({ }) => {
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            subject: '',
            message: ''
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        }
    })

    function errorMessage(msg: string) {
        showNotification({
            title: "Message Error",
            message: msg,
            color: 'red',
            autoClose: 1000 * 10
        })
    }

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        form.validate()

        async function main() {
            let name = form.values.name
            let email = form.values.email 
            let subject = form.values.subject
            let message = form.values.message 

            if(name.length === 0) {
                errorMessage("You need to type a name first")
                return
            }

            if(subject.length === 0) {
                errorMessage("Please type the subject of your message")
                return
            }

            if(message.length === 0) {
                errorMessage("Please type a message")
                return
            }


        }

        main()
    }

    return (
        <div>
            <ApplicationLayout
				title="About Sigmyze"
				description="Our Mission is to make life easier when it comes to handling data. Whether it is visualization,"
				location="/about"
				protectedView={false}
                darken={true}
			>
                <div className={styles.hero}>
                    <div className={styles.title}>Additional Info</div>

                    <div className={styles.mission}>
                        Our Mission is to make life easier when it comes to handling data. 
                        Whether it is visualization, analysis, or integration into presentation formats, 
                        we strive to save you time.
                    </div>
                </div>

                <div className={styles.chooseWrapper}>
                    <div className={styles.container}>
                        <div className={styles.sectionTitle}>The Best Tool</div>
                        <div className={styles.focusText}>Why Choose Sigmyze</div>

                        <div className={styles.cardWrapper}>
                            <div className={styles.card}>
                                <Box py={5}>
                                    <IconFileAnalytics 
                                        size={36} 
                                        stroke={2} 
                                        color={"#FFFFFF"}
                                    />
                                </Box>

                                <Stack spacing={12}>
                                    <div className={styles.cardTitle}>Seamless Editing</div>
                                    <div className={styles.styleRect}></div>
                                </Stack>

                                <Box py={10}>
                                    <div className={styles.description}>
                                        Don't waste  on silly things like formatting and layout. 
                                        With our node based text editor, you can edit and format documents much quicker. 
                                        Additionally, Data is treated as a first class citizen, making integrating interactive 
                                        visualizations into your documents much easier.
                                    </div>
                                </Box>
                            </div>

                            <div className={styles.card}>
                                <Box py={5}>
                                    <IconDeviceDesktopAnalytics 
                                        size={36} 
                                        stroke={2} 
                                        color={"#FFFFFF"}
                                    />
                                </Box>

                                <Stack spacing={12}>
                                    <div className={styles.cardTitle}>Powerful Visualizations</div>
                                    <div className={styles.styleRect}></div>
                                </Stack>

                                <Box py={10}>
                                    <div className={styles.description}>
                                        Combining different datasets into one single visualization has never been easier. 
                                        Instead of fumbling through multiple slow spreadsheets, in just a few clicks you can 
                                        start creating detailed, beautiful visualizations.
                                    </div>
                                </Box>
                            </div>

                            <div className={styles.card}>
                                <Box py={5}>
                                    <IconCloudComputing 
                                        size={36} 
                                        stroke={2} 
                                        color={"#FFFFFF"}
                                    />
                                </Box>

                                <Stack spacing={12}>
                                    <div className={styles.cardTitle}>Portable</div>
                                    <div className={styles.styleRect}></div>
                                </Stack>

                                <Box py={10}>
                                    <div className={styles.description}>
                                        Don’t ever worry about having to access your data again, with Sigmyze, 
                                        all your data travels with you., as long as you have an internet connection. 
                                        Additionally, share your documents with anyone, while preserving the visualizations 
                                        interactivity.
                                    </div>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.roadmap}>
                    <div className={styles.sectionTitle}>Product Roadmap</div>

                    <div className={styles.roadmapWrapper}>
                        <div className={styles.roadmapItem}>
                            <div className={styles.styleRect}></div>
                            <div className={styles.sectionTitle}>Coming Soon</div>
                            <div className={styles.itemTitle}>A Blog!</div>
                            <div className={styles.itemDescription}>
                                With the addition of the blog, communication between us and you will become much 
                                more easier and frequent, giving you a more accurate peek of what's happening 
                                behind the scenes
                            </div>
                        </div>

                        <div className={styles.roadmapItem}>
                            <div className={styles.styleRect}></div>
                            <div className={styles.sectionTitle}>Coming Soon</div>
                            <div className={styles.itemTitle}>More Data!</div>
                            <div className={styles.itemDescription}>
                                We plan on rapidly expanding the number of datasets that we host. 
                                First by introducing more dynamic economic indicators, along with the stock and 
                                commodities markets.
                            </div>
                        </div>
                        
                        <div className={styles.roadmapItem}>
                            <div className={styles.styleRect}></div>
                            <div className={styles.sectionTitle}>Coming Soon</div>
                            <div className={styles.itemTitle}>More Integrations!</div>
                            <div className={styles.itemDescription}>
                                Making sure that our services can integrate with apps already in your workflow is key, 
                                and we plan on adding integrations for all major platforms to make adding visualizations 
                                as painless as possible
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.contactSection}>
                    <div className={styles.contact}>
                        <div className={styles.info}>
                            <div className={styles.sectionTitle}>Contact Information</div>

                            <div className={styles.contactItems}>
                                <div className={styles.item}>
                                    <IconAt />

                                    <div className={styles.text}>
                                        <div className={styles.title}>E-mail</div>
                                        <div className={styles.value}>sigmyze@gmail.com</div>
                                    </div>
                                </div>

                                <div className={styles.item}>
                                    <IconMapPin />

                                    <div className={styles.text}>
                                        <div className={styles.title}>Location</div>
                                        <div className={styles.value}>Fremont, CA</div>
                                    </div>
                                </div>

                                <div className={styles.item}>
                                    <IconSun />

                                    <div className={styles.text}>
                                        <div className={styles.title}>Working Hours</div>
                                        <div className={styles.value}>4pm - 8pm (PST)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.contactForm}>
                            <div className={styles.sectionTitle}>Get In Touch</div>

                            <form className={styles.form} onSubmit={onSubmit}>
                                <Group spacing={16} grow>
                                    <TextInput 
                                        required
                                        withAsterisk
                                        label={"Your Name"}
                                        size={"md"}
                                        variant={"filled"}
                                        type={"text"}
                                        placeholder={"Your Name"}
                                        styles={{ input: { height: 40 } }}
                                        {...form.getInputProps('name')}
                                    />

                                    <TextInput 
                                        required
                                        withAsterisk
                                        label={"Your E-Mail"}
                                        size={"md"}
                                        variant={"filled"}
                                        type={"email"}
                                        placeholder={"Your Email"}
                                        styles={{ input: { height: 40 } }}
                                        {...form.getInputProps('email')}
                                    />
                                </Group>

                                <TextInput 
                                    required
                                    withAsterisk
                                    label={"Subject"}
                                    size={"md"}
                                    variant={"filled"}
                                    type={"text"}
                                    placeholder={"Subject of the message"}
                                    styles={{ input: { height: 40 } }}
                                    {...form.getInputProps('subject')}
                                />

                                <Textarea 
                                    required
                                    withAsterisk
                                    label={"Message"}
                                    size={"md"}
                                    variant={"filled"}
                                    styles={{ input: { height: 104 } }}
                                    placeholder={"Subject of the message"}
                                    {...form.getInputProps('message')}
                                />

                                <Group position={"right"}>
                                    <Button
                                        type="submit"
                                        variant={"filled"}
                                        color={"indigo"}
                                        radius={"xl"}
                                    >
                                        Send
                                    </Button>
                                </Group>
                            </form>
                        </div>
                    </div>
                </div>

                <Footer />
            </ApplicationLayout>
        </div>
    )
}

export default AboutPage