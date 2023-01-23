import { Anchor, Button, Checkbox, Group, LoadingOverlay, PasswordInput, Stack, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { FormEvent, useContext, useState } from "react"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"

interface ISignupFormProps {
    switchModal: (id: string) => void,
    closeModal: () => void
}

const SignupForm: React.FC<ISignupFormProps> = ({ switchModal, closeModal }) => {
    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            email: '',
            pwd: '',
            pwdConf: '',
            name: '',
            terms: false
        },

        validateInputOnBlur: ['email', 'pwd', 'pwdConf'],

        validate: {
            email: (val) => /^\S+@\S+$/.test(val) ? "Please enter a valid email" : null,
            pwd: (val) => val.length <= 6 ? "Please type a longer password" : null,
            pwdConf: (val, vals) => val === vals.pwdConf ? null : "Passwords do not match",
            terms: (val) => !val ? "You must accept the TOS" : null,
            name: (val) => val.trim().length === 0 ? "You must type a username" : null
        }
    })

    const { register } = useContext(UserContextData) as IUserContext

    //TODO implement
    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if(register === undefined)
            return

        async function main() {
            setLoading(true)
            await register!(form.values.email, form.values.name, form.values.pwd)
            setLoading(false)

            closeModal()
        }

        main()
    }
    
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay 
                visible={loading}
                overlayBlur={2}
                transitionDuration={250}
            />
            
            <form 
                autoComplete={"off"}
                onSubmit={e => onSubmit(e)}
            >
                <input type="text" style={{ display: "none" }} />
                <input type="password" style={{ display: "none" }} />

                <Stack p={"md"}>
                    <Stack>
                        <TextInput
                            withAsterisk
                            required
                            label="Username"
                            placeholder="Your Username"
                            {...form.getInputProps('name')}
                        />

                        <TextInput
                            withAsterisk
                            required
                            label="E-Mail"
                            placeholder="example@gmail.com"
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            required
                            withAsterisk
                            label="Password"
                            placeholder="Your Password"
                            {...form.getInputProps('pwd')}
                        />

                        <PasswordInput
                            required
                            withAsterisk
                            label="Password Confirmation"
                            placeholder="Password Confirmation"
                            {...form.getInputProps('pwdConf')}
                        />

                        <Checkbox
                            required
                            label={"I accept the Terms of Service (TOS)"}
                            {...form.getInputProps('terms')}
                        />
                    </Stack>

                    <Group
                        mt={'xl'}
                        position={'apart'}
                    >
                        <Anchor
                            component={"button"}
                            type={"button"}
                            color={"gray"}
                            size={"xs"}
                            onClick={() => switchModal("login-modal")}
                        >
                            Already have an account? Login here
                        </Anchor>

                        <Button type={'submit'}>Register</Button>
                    </Group>
                </Stack>
            </form>
        </div>
    )
}

export default SignupForm