import { Button, Group, Textarea, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { FormEvent, useContext } from "react"
import React from "react"
import styles from '../../../styles/info.module.scss'
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import { SendAboutMessage } from "../../data/user/user-api"

const SendMessageCard: React.FC = ({ }) => {
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

    const userContext = useContext(UserContextData) as IUserContext

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

            if(userContext.loggedIn !== true) {
                errorMessage("You must be logged in to send a message")
                return
            }

            await SendAboutMessage(name, email, subject, message)
            showNotification({
                title: "Message Success",
                message: "Your message has been successfully sent",
                color: 'green',
                autoClose: 1000 * 10
            })
        }

        main()
    }

    return (
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
    )
}

export default SendMessageCard