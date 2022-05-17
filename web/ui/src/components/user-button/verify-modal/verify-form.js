import React from "react"
import { useForm } from "@mantine/hooks"

import { 
    Group,
    TextInput,
    Anchor,
    Button
} from "@mantine/core"

const VerifyForm = ({ }) => {
    const form = useForm({
        initialValues: {
            token: ''
        },
    })

    function OnSubmit(e) {
        e.preventDefault()
    }

    return (
        <form onSubmit={OnSubmit}>
            <Group direction={"column"} grow>
                <TextInput
                    required
                    label="Code"
                    placeholder="Your Code"
                    value={form.values.token}
                    onChange={(event) => form.setFieldValue('token', event.currentTarget.value)}
                />
            </Group>

            <Group position={"apart"} mt={"xl"}>
                <Anchor component={"button"} type={"button"} color={"gray"} size={"xs"}>
                    Didnt get the email? Send it again
                </Anchor>

                <Button type={"submit"}>Verify</Button>
            </Group>
        </form>
    )
}

export default VerifyForm