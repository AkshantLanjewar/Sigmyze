import { Anchor, Button, Group, LoadingOverlay, PasswordInput, Stack, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { FormEvent, useContext, useState } from "react"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"

interface ILoginFormProps {
    switchModal: (id: string) => void,
    closeModal: () => void
}

const LoginForm: React.FC<ILoginFormProps> = ({ switchModal, closeModal }) => {
    const [loading, setLoading] = useState(false)

    const form  = useForm({
        initialValues: {
            email: '',
            password: ''
        },

        validate: {
            email: (val) => /^\S+@\S+$/.test(val) ? "Please enter a valid email" : null,
        }
    })

    const { login } = useContext(UserContextData) as IUserContext

    //TODO implement
    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if(login === undefined)
            return

        async function main() {
            setLoading(true)
            await login!(form.values.email, form.values.password)
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

            <form onSubmit={e => onSubmit(e)}>
                <Stack p={"md"}>
                    <Stack>
                        <TextInput 
                            required
                            withAsterisk
                            label={"E-Mail"}
                            placeholder={"example@gmail.com"}
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput 
                            required
                            withAsterisk
                            placeholder={"Your Password"}
                            label={"Password"}
                            {...form.getInputProps('password')}
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
                            onClick={() => switchModal("signup-modal")}
                        >
                            Dont have an account? Register here
                        </Anchor>

                        <Button type={'submit'}>Login</Button>
                    </Group>
                </Stack>
            </form>            
        </div>
    )
}

export default LoginForm